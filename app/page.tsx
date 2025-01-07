'use client';

import { GraduationCap, Users, ArrowRight, TypeIcon as type, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

interface PortalCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  buttonColor: string;
}

const PortalCard: React.FC<PortalCardProps> = ({
  href,
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  buttonColor
}) => (
  <Link href={href} className="block">
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
      <Card className="overflow-hidden bg-white/90 backdrop-blur-lg border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className={`flex items-center justify-center w-20 h-20 rounded-2xl mb-8 bg-gradient-to-br from-${gradientFrom} to-${gradientTo} shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300`}>
            <Icon className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h2>
          
          <p className="text-gray-600 text-lg mb-8">
            {description}
          </p>
          
          <motion.div
            whileHover={{ x: 5 }}
            className={`inline-flex items-center px-6 py-3 rounded-xl text-white ${
              buttonColor === 'purple' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-500' 
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500'
            } shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <span className="mr-2">Login as {title.split(' ')[0]}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 via-purple-500/20 to-pink-500/20 animate-gradient-xy"></div>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Parent-Teacher Interaction Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Elevating education through seamless communication between parents and teachers, 
            fostering collaborative academic growth and student success.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <PortalCard
              href="/login?role=parent"
              icon={Users}
              title="Parent Portal"
              description="Schedule meetings with teachers, monitor academic progress, and stay actively involved in your child's educational journey."
              gradientFrom="purple-500"
              gradientTo="indigo-500"
              buttonColor="purple"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PortalCard
              href="/login?role=teacher"
              icon={GraduationCap}
              title="Teacher Portal"
              description="Efficiently manage parent interactions, track student progress, and create meaningful educational partnerships."
              gradientFrom="indigo-500"
              gradientTo="blue-500"
              buttonColor="indigo"
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}

