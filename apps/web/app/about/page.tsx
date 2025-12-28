import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getSkillsGrouped, getExperience, type GroupedSkills, type ExperienceDto } from "@/lib/api";

export const metadata = {
  title: "About | Ayyaz Zafar",
  description: "Learn about Ayyaz Zafar - Full-stack developer with 15+ years of experience.",
};

const categoryLabels: Record<string, string> = {
  FRONTEND: "Frontend Development",
  BACKEND: "Backend Development",
  DATABASE: "Databases",
  DEVOPS: "DevOps & Cloud",
  TOOLS: "Tools & Platforms",
  AI: "AI & Automation",
};

const categoryOrder = ["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "TOOLS", "AI"];

export default async function AboutPage() {
  let skills: GroupedSkills = {};
  let experience: ExperienceDto[] = [];

  try {
    [skills, experience] = await Promise.all([
      getSkillsGrouped(),
      getExperience(),
    ]);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  const sortedCategories = Object.keys(skills).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Full-stack developer with 15+ years of experience building web
            applications.
          </p>
        </div>

        {/* Bio Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                I'm Ayyaz Zafar, a passionate full-stack developer based in
                Pakistan. With over 15 years in the industry, I've worked on
                everything from small startups to enterprise applications.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                My focus is on building modern, scalable web applications using
                the JavaScript ecosystem. I specialize in React, Next.js,
                Node.js, and Laravel, with a strong emphasis on clean code and
                best practices.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Beyond coding, I run the{" "}
                <a
                  href="https://www.youtube.com/@AyyazTech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  AyyazTech YouTube channel
                </a>{" "}
                where I share tutorials on Next.js, AI automation, and modern
                web development.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        {sortedCategories.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {sortedCategories.map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {categoryLabels[category] || category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {skills[category]
                        ?.sort((a, b) => b.level - a.level)
                        .map((skill) => (
                          <div key={skill.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{skill.name}</span>
                              <span className="text-muted-foreground">
                                {skill.level}%
                              </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <Card key={exp.id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <CardTitle className="text-xl">{exp.role}</CardTitle>
                        <CardDescription className="text-base">
                          {exp.company}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {new Date(exp.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}{" "}
                          -{" "}
                          {exp.current
                            ? "Present"
                            : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })
                            : "Present"}
                        </Badge>
                        {exp.current && <Badge>Current</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  {exp.description && (
                    <CardContent>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-8 space-y-4 border-t">
          <h3 className="text-xl font-semibold">Want to work together?</h3>
          <p className="text-muted-foreground">
            I'm always open to discussing new projects and opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/projects">
              <Button variant="outline">View Projects</Button>
            </Link>
            <Link href="/contact">
              <Button>Get In Touch</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
