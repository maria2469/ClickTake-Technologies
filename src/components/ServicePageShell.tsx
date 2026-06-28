import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "./Navbar";

interface Props {
    eyebrow: string;
    title: string;
    description: string;
    children?: React.ReactNode;
}

export function ServicePageShell({ eyebrow, title, description, children }: Props) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="relative z-10 pt-44 pb-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Services
                    </Link>

                    <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">{eyebrow}</div>
                    <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{description}</p>

                    <div className="mt-12 prose prose-invert max-w-none">{children}</div>

                    <div className="mt-16 rounded-2xl border border-border bg-card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="text-lg font-bold">Ready to get started?</div>
                            <div className="text-sm text-muted-foreground">Book a consultation and let's scope it together.</div>
                        </div>
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Book a Call <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
