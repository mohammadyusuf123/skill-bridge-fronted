import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp, 
  GraduationCap,
  Clock,
  Shield,
  Trophy,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import LearningBanner from '@/components/ui/learningBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />

      {/* Hero Section */}
      {/* <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="w-fit">
                <Sparkles className="h-3 w-3 mr-1" />
                Trusted by 10,000+ Students
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect
                <span className="text-primary"> Tutor</span> Today
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with expert tutors for personalized one-on-one learning sessions.
                Achieve your academic goals with the best tutors worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/tutors">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Browse Tutors
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full bg-primary/20 border-2 border-background" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">2,500+ Tutors</div>
                    <div className="text-muted-foreground">Available now</div>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 font-semibold">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    4.9/5
                  </div>
                  <div className="text-muted-foreground">Student rating</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">50+ Subjects</CardTitle>
                    <CardDescription>From math to music</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="hover:shadow-lg transition-shadow mt-8">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">98% Success</CardTitle>
                    <CardDescription>Student satisfaction</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">24/7 Support</CardTitle>
                    <CardDescription>Always here to help</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="hover:shadow-lg transition-shadow mt-8">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Verified Tutors</CardTitle>
                    <CardDescription>Background checked</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <LearningBanner />

    </div>
  );
}
