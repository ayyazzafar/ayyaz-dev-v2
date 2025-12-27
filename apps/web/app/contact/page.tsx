"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@ayyaz-dev/ui/components/button";
import { Input } from "@ayyaz-dev/ui/components/input";
import { Textarea } from "@ayyaz-dev/ui/components/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ayyaz-dev/ui/components/card";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // For now, just simulate submission
    // TODO: Integrate with actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Get In Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have a project in mind or just want to say hi? I'd love to hear from
            you.
          </p>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              Fill out the form below and I'll get back to you as soon as
              possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="text-4xl">✉️</div>
                <h3 className="text-xl font-semibold">Message Sent!</h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. I'll get back to you soon.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows={6}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Alternative Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Other Ways to Reach Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/ayyazzafar"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">GitHub</Button>
              </a>
              <a
                href="https://www.youtube.com/@AyyazTech"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">YouTube</Button>
              </a>
              <a
                href="https://linkedin.com/in/ayyazzafar"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">LinkedIn</Button>
              </a>
              <a href="mailto:hello@ayyaz.dev">
                <Button variant="outline">Email</Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost">&larr; Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
