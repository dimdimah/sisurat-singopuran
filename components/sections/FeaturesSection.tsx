"use client";

import dynamic from "next/dynamic";
const MotionCard = dynamic(() =>
  import("framer-motion").then((mod) => mod.motion.div)
);
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturesSection({ features, container, item }: any) {
  return (
    <section id="features" className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            Layanan
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Jenis Surat Keterangan
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Berbagai layanan surat keterangan yang dapat diajukan secara online
            untuk warga Desa Singopuran.
          </p>
        </MotionCard>

        <MotionCard
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature: any, i: number) => (
            <MotionCard key={i} variants={item}>
              <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </MotionCard>
          ))}
        </MotionCard>
      </div>
    </section>
  );
}
