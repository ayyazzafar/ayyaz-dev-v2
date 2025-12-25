
"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";
import type { DataProvider } from "@refinedev/core";
import Cookies from "js-cookie";
import { create } from "domain";

const API_URL = "http://localhost:4000/api";

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
    const token = Cookies.get("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};
export const dataProvider: DataProvider = {
    getList: async ({ resource, pagination, filters }) => {
        const { currentPage = 1, pageSize = 10 } = pagination ?? {};
        const skip = (currentPage - 1) * pageSize;
        const take = pageSize;

        const query = new URLSearchParams();
        query.set("skip", String(skip));
        query.set("take", String(take));

        filters?.forEach((filter: any) => {
            if (filter.value !== undefined && filter.value !== "") {
                query.set(filter.field, String(filter.value));
            }
        });

        const response = await fetch(`${API_URL}/${resource}?${query.toString()}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();

        return {
            data: data.data || [],
            total: data.meta?.total || 0,
        };
    },

    getOne: async ({ resource, id }) => {
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        return { data };
    },

    create: async ({ resource, variables }) => {
        const response = await fetch(`${API_URL}/${resource}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(variables),
        });
        const data = await response.json();
        // Check if the response was an error
        if (!response.ok) {
            // Refine expects this error format
            const error: any = new Error(
                Array.isArray(data.message) ? data.message.join(", ") : data.message
            );
            error.statusCode = response.status;
            throw error;
        }

        return { data };
    },

    update: async ({ resource, id, variables }) => {
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(variables),
        });
        const data = await response.json();
        // Check if the response was an error
        if (!response.ok) {
            // Refine expects this error format
            const error: any = new Error(
                Array.isArray(data.message) ? data.message.join(", ") : data.message
            );
            error.statusCode = response.status;
            throw error;
        }

        return { data };
    },

    deleteOne: async ({ resource, id }) => {
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        // Check if the response was an error
        if (!response.ok) {
            // Refine expects this error format
            const error: any = new Error(
                Array.isArray(data.message) ? data.message.join(", ") : data.message
            );
            error.statusCode = response.status;
            throw error;
        }

        return { data };
    },

    getApiUrl: () => API_URL,
}