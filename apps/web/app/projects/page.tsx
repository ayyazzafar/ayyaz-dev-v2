import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/api";

export const metadata = {
  title: "Projects | Ayyaz Zafar",
  description: "Browse my portfolio of web development projects built with React, Next.js, Node.js, and more.",
};

export default async function ProjectsPage() {
  let projects = [];

  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-lg text-muted-foreground">
            A collection of my work including personal projects, client work, and experiments.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  {project.images && project.images.length > 0 && (
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                      <img
                        src={project.images[0].url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                          {project.type}
                        </Badge>
                        {project.featured && (
                          <Badge className="text-xs whitespace-nowrap">Featured</Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <Badge key={tech.id} variant="outline" className="text-xs">
                            {tech.name}
                          </Badge>
                        ))}
                        {project.technologies.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 5}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects found.</p>
            <p className="text-sm text-muted-foreground">
              Check back later for updates!
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="pt-8">
          <Link href="/">
            <Button variant="ghost">&larr; Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
