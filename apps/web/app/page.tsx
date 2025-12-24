import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProjects } from "@/lib/api";

export default async function HomePage() {
  let featuredProjects = [];

  try {
    featuredProjects = await getFeaturedProjects();
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Hi, I'm <span className="text-primary">Ayyaz Zafar</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Full-Stack Developer with 15+ years of experience building web
            applications with React, Next.js, Node.js, and Laravel.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/projects">
              <Button size="lg">View My Work</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="container mx-auto px-4 py-16 border-t">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Featured Projects</h2>
              <p className="text-muted-foreground">
                A selection of my recent work
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {project.images && project.images.length > 0 && (
                      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <img
                          src={project.images[0].url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant="secondary">{project.type}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <Badge key={tech.id} variant="outline" className="text-xs">
                              {tech.name}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/projects">
                <Button variant="outline">View All Projects</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Skills Preview */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">What I Do</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frontend</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                React, Next.js, TypeScript, Tailwind CSS, Angular
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Backend</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Node.js, NestJS, Laravel, PostgreSQL, Prisma
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">DevOps & AI</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Docker, n8n Automation, Vercel, AI Integration
              </CardContent>
            </Card>
          </div>
          <Link href="/about">
            <Button variant="link">Learn more about me &rarr;</Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Let's Work Together</h2>
          <p className="text-muted-foreground">
            Have a project in mind? I'd love to hear about it. Let's discuss how
            I can help bring your ideas to life.
          </p>
          <Link href="/contact">
            <Button size="lg">Start a Conversation</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
