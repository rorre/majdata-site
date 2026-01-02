import { Twitter } from "lucide-react"
import { SiDiscord } from "@icons-pack/react-simple-icons"
import { Button } from "@/components/ui/button"
import Shizu from "/src/shizu.png"

interface HeroLink {
  icon: React.ReactNode
  label: string
  url: string
}

export function Hero() {
  const links: HeroLink[] = [
    {
      icon: <SiDiscord size={20} />,
      label: "Discord",
      url: "https://discord.com/users/236478127352709121",
    },
    {
      icon: <Twitter size={20} />,
      label: "Twitter",
      url: "https://twitter.com/FelisSkunk",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-muted to-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img src={Shizu} alt="Shizu" className="rounded-lg h-80" />

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Shizu's Charts
            </h1>

            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Some charts I made when I'm bored.
            </p>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {links.map((link) => (
                <Button
                  key={link.label}
                  asChild
                  variant="outline"
                  className="inline-flex items-center gap-2"
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.icon}
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
