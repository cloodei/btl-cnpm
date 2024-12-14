import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Crown } from "lucide-react";
import { Suspense } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import CommunityTab from "@/components/explore-content/community-tab";

export const metadata = {
  title: 'Browse | CoinCard'
};

const featured = [
  { id: 11, name: "Everyday Words: From English to French", description: "Quickstart Guide to speaking French", totalcards: 25 },
  { id: 12, name: "Vocabulary Expansion", description: "Highly Educative Expressions", totalcards: 20 },
  { id: 9, name: "French Foundations: Expanding Your Vocabulary", description: "Take your French to Exceeding Heights", totalcards: 40 },
];

const sponsored = [
  {
    id: 1,
    name: "Introduction to C++",
    description: "Learn more about the basics of C++",
    image: '/into_to_c-27411.png',
    link: "https://drive.google.com/file/d/1NOLcOhvxT87NQOStH-aFCWdZJrz7S3um/view?fbclid=IwY2xjawG7mxhleHRuA2FlbQIxMAABHcXaC7QYkU773dPfRD4rz8t1F15ZHyD4QJnJ4LKYR64ZGPn9r_Jrupp6_A_aem_L_c2FG-u_PvLBFxG0nHbuQ",
  },
  {
    id: 2,
    name: "Python Programming",
    description: "Get to know about the basics of Python",
    image: '/3720230404141603.webp',
    link: "https://drive.google.com/drive/folders/1LkRwAiwcIFL9ZFjJFn0aJ2LzBKTD5uzt?fbclid=IwY2xjawG7mxpleHRuA2FlbQIxMAABHQkfTHK5yPCIoRfv7ObICpQo8Ogb6SSKUErEjbVXaxnftUE6uLWvGvkv8A_aem_Pn3JZ-j3ebIhBWfbKWQpJQ",
  },
  {
    id: 3,
    name: "Curso Prático de Hipnóse",
    description: "Aprenda a hipnotizar pessoas em 3 dias",
    image: '/hypnosisCover.png',
    link: "https://drive.google.com/file/d/0BzuUnGoH_Od9eUlfbWwzTUhuVTg/view?fbclid=IwY2xjawG7mxpleHRuA2FlbQIxMAABHVB6JwSNEqJZbMDjtObE9T4m2x8sSphJjcVQULZTCK07FiPhxEdh0ooTVg_aem_te58q3NvXSCrNU9X-pXbMA&resourcekey=0-ayDMD_z46M76vxenGbPpCQ",
  },
  {
    id: 4,
    name: "C# and .NET Basics",
    description: "Learn the basics of C# and .NET programming",
    image: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230305130205/Csharp1.png",
    link: "https://drive.google.com/file/d/0BzuUnGoH_Od9alBUZ3g0ZkQ1Z0k/view?fbclid=IwY2xjawG7mxtleHRuA2FlbQIxMAABHWKQ4ZnPkrYvdOmDyxSLNxYQ-hXKSjm0lPx9eZfzHb1QV51EmhOA_wbyfw_aem_JbLZkO7ozXyVSI0DZmW7ww&resourcekey=0-ICg5M7Elp2eQIt43joXaJA",
  },
  {
    id: 5,
    name: "Sách ngữ pháp Tiếng Anh",
    description: "Học ngữ pháp Tiếng Anh cùng cô Mai Lan Hương",
    image: "https://salt.tikicdn.com/cache/w300/media/catalog/product/g/i/giai-thich-ngu-phap-tieng-anh.jpg",
    link: "https://drive.google.com/file/d/0B1saKAllAzg3NVp3NmdjYjBOcnc/view?fbclid=IwY2xjawG7mx1leHRuA2FlbQIxMAABHVB6JwSNEqJZbMDjtObE9T4m2x8sSphJjcVQULZTCK07FiPhxEdh0ooTVg_aem_te58q3NvXSCrNU9X-pXbMA&resourcekey=0-S-NqD5GNKhhBqlr85P9Acg",
  },
  {
    id: 6,
    name: "Python for Data Analysis",
    description: "Understand more about Data Analysis with Python",
    image: '/pyDataAnalysisCover.png',
    link: "https://drive.google.com/file/d/1JeeJ1jWkCe9cdcyC8H0AJBHKOX_62p1K/view?fbclid=IwY2xjawG7mxxleHRuA2FlbQIxMAABHZbOsKaFL0GnXAyMGViEsrFrnHc5CxkSjjMUt0F8Hzx3pVXTbywjGHO1pA_aem_YhdyAGc0iwUs05-kHLPVmg",
  },
  {
    id: 7,
    name: "25 Chuyên đề Ngữ pháp Tiếng Anh",
    description: "Những chuyên đề ngữ pháp Tiếng Anh phổ biến",
    image: '/chuyenDeNguPhapTACover.png',
    link: "https://drive.google.com/file/d/16rjnZDmh-_Kzl0eXGiN1ojGbRxXjFzpa/view?fbclid=IwY2xjawG7og1leHRuA2FlbQIxMAABHcajRIeWWeSo7qz4hBLCRyMN1cmTL6zE2IEdh9WuoYKPLrsbWvV05dIx7g_aem_NH8_2xHZYi6poNdk8__gLQ",
  },
  {
    id: 8,
    name: "Thinking Like a Data Scientist",
    description: "Find out more about the lifecycle of a Data Scientist",
    image: '/dataScientistCover.png',
    link: "https://drive.google.com/file/d/1kso0VI-jNjp0_K--NR_9pyilu4OATELe/view?fbclid=IwY2xjawG7oBhleHRuA2FlbQIxMAABHTFvp_crWT4nkEkjvEmpY7EUukBCVTf3Wrkk0cSHkrP2vJ-kic218VziyQ_aem_5tm-l8bAL788X_nrf2WrPA",
  }
];

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="recommended" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:w-[300px] w-[240px]">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="lg:space-y-[56px] space-y-8">
          <section className="pb-6">
            <h2 className="text-2xl font-bold mb-4 [text-shadow:_0_3px_6px_rgb(18,18,24,0.25)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">Featured Decks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((deck, index) => (
                <Link href={`/decks/${deck.id}`} passHref key={index}>
                  <Card title={deck.name} className="p-6 shadow-[0_3px_4px_rgba(0,0,0,0.25)] dark:border-[#34393f] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:scale-[1.02]">
                    <div className="flex items-center space-x-2 mb-4">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Featured</span>
                    </div>
                    <div className="pr-4">
                      <h3 className="text-2xl font-bold md:mb-[7px] truncate mb-1">{deck.name}</h3>
                    </div>
                    <div className="text-muted-foreground md:mb-[19px] mb-[13px] flex items-center lg:gap-2 gap-[6px]">
                      <Crown className="h-4 w-4 text-primary font-semibold" />
                      <span>{deck.description}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{deck.totalcards} cards</span>
                      </div>
                      <Button size="lg">Study Now</Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <h2 className="text-2xl font-bold [text-shadow:_0_3px_6px_rgb(18,18,24,0.25)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">See Documentations</h2>
          <section className="px-7" style={{ marginTop: '16px' }}>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="px-[6px] py-2">
                {sponsored.map((card, index) => (
                  <CarouselItem key={index} className="grid p-1 md:basis-1/3 lg:basis-1/5 pl-[14px]">
                    <Card className="overflow-hidden dark:border-[#2f3235] shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-all hover:scale-[1.02]">
                      <CardContent className="p-0">
                        <div className="relative h-48 sm:h-64">
                          <Image
                            src={card.image}
                            alt={card.name}
                            fill
                            className="object-cover"
                            sizes="(min-width: 640px) 100vw, 50vw"
                          />
                        </div>
                        <div className="p-4 pt-3 border-t border-t-gray-900/15 dark:border-none">
                          <h3 className="text-xl font-semibold mb-[10px]">{card.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                          <Link href={card.link} passHref target="_blank">
                            <Button className="w-full">
                              Learn More
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:inline-flex" />
              <CarouselNext className="hidden md:inline-flex" />
            </Carousel>
          </section>
        </TabsContent>
        
        <TabsContent value="community" style={{ marginTop: 0 }}>
          <Suspense fallback={<div className="text-center text-2xl py-8 text-muted-foreground">Loading Community Decks...</div>}>
            <CommunityTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}