import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProjectBySlug, type Project } from "@/lib/api";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;

  try {
    const project = await getProjectBySlug(slug);
    return {
      title: `${project.title} | Ayyaz Zafar`,
      description: project.description || `View ${project.title} project by Ayyaz Zafar`,
    };
  } catch {
    return {
      title: "Project Not Found | Ayyaz Zafar",
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  let project: Project;

  try {
    project = await getProjectBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/projects">
          <Button variant="ghost">&larr; Back to Projects</Button>
        </Link>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.type}</Badge>
            <Badge
              variant={project.status === "COMPLETED" ? "default" : "outline"}
            >
              {project.status}
            </Badge>
            {project.featured && <Badge>Featured</Badge>}
          </div>

          <h1 className="text-4xl font-bold">{project.title}</h1>

          {project.description && (
            <p className="text-xl text-muted-foreground">{project.description}</p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <Button>View Demo</Button>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">View Code</Button>
              </a>
            )}
          </div>
        </div>

        {/* Project Images Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="space-y-4">
            {/* Main/Cover Image */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={project.images[0]?.url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Additional Images Grid */}
            {project.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.slice(1).map((image, index) => (
                  <div
                    key={image.id || index}
                    className="aspect-video bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={`${project.title} - Image ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technologies Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech.id} variant="outline" className="text-sm">
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Content */}
        {project.longDescription && (
          <>
            <Separator />
            <div className="prose prose-invert max-w-none">
              <div
                className="text-foreground/90 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: project.longDescription }}
              />
            </div>
          </>
        )}

        {/* Project Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>{" "}
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>{" "}
                {new Date(project.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center py-8 space-y-4">
          <h3 className="text-xl font-semibold">Interested in this project?</h3>
          <p className="text-muted-foreground">
            Get in touch to discuss how I can help with your project.
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Me</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
