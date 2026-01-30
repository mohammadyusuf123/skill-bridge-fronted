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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 lg:py-32">
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
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and support you need for effective learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Expert Tutors</CardTitle>
                <CardDescription className="text-base">
                  Verified and experienced tutors with proven track records in their subjects
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-14 w-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>All Subjects</CardTitle>
                <CardDescription className="text-base">
                  From mathematics to music, find expert tutors for any subject you need
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-14 w-14 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle>Rated Reviews</CardTitle>
                <CardDescription className="text-base">
                  Read honest reviews from other students to make informed decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription className="text-base">
                  Monitor your learning journey with detailed statistics and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Browse Tutors</h3>
              <p className="text-muted-foreground">
                Search and filter through our network of verified tutors by subject, price, and rating
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">Book Session</h3>
              <p className="text-muted-foreground">
                Choose your preferred time and date, and book your session instantly
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Start Learning</h3>
              <p className="text-muted-foreground">
                Connect with your tutor and begin your personalized learning journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="mb-2">
                Student Benefits
              </Badge>
              <h2 className="text-4xl font-bold">Why Students Love Us</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of students who have achieved their academic goals with our platform
              </p>
              <ul className="space-y-4">
                {[
                  'Instant booking confirmation',
                  'Flexible scheduling',
                  'Secure payment processing',
                  'Money-back guarantee',
                  'Dedicated customer support',
                  'Progress tracking tools'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">98%</div>
                  <p className="text-muted-foreground">Student Satisfaction Rate</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">50K+</div>
                    <p className="text-sm text-muted-foreground">Active Students</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">2.5K+</div>
                    <p className="text-sm text-muted-foreground">Expert Tutors</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">100K+</div>
                    <p className="text-sm text-muted-foreground">Sessions Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">4.9★</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who are already learning with our platform.
            Get started today with a free account!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/tutors">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Browse Tutors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">TutorPlatform</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting students with expert tutors for personalized learning experiences.
              </p>
              <div className="flex gap-4">
                {/* Add social media icons here */}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/tutors" className="hover:text-primary">Find Tutors</Link></li>
                <li><Link href="/register" className="hover:text-primary">Sign Up</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary">My Dashboard</Link></li>
                <li><Link href="/dashboard/bookings" className="hover:text-primary">My Bookings</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Tutors</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/register" className="hover:text-primary">Become a Tutor</Link></li>
                <li><Link href="/tutor/dashboard" className="hover:text-primary">Tutor Dashboard</Link></li>
                <li><Link href="/tutor/profile" className="hover:text-primary">My Profile</Link></li>
                <li><Link href="/tutor/availability" className="hover:text-primary">Set Availability</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 TutorPlatform. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary">Privacy</a>
                <a href="#" className="hover:text-primary">Terms</a>
                <a href="#" className="hover:text-primary">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
