import React, { useEffect, useState } from 'react';
import { Wallet, BarChart, DollarSign, PieChart, TrendingUp } from 'lucide-react';

export function WelcomePage() {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStage(1), 500);
    const timer2 = setTimeout(() => setAnimationStage(2), 1000);
    const timer3 = setTimeout(() => setAnimationStage(3), 1500);
    const timer4 = setTimeout(() => setAnimationStage(4), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
      <div className="relative mb-8">
        <div className={`absolute -top-16 -left-16 bg-white bg-opacity-20 rounded-full p-4 transition-all duration-1000 ${
          animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Wallet size={32} />
        </div>
        <div className={`absolute -top-16 -right-16 bg-white bg-opacity-20 rounded-full p-4 transition-all duration-1000 ${
          animationStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <BarChart size={32} />
        </div>
        <div className={`absolute -bottom-16 -left-16 bg-white bg-opacity-20 rounded-full p-4 transition-all duration-1000 ${
          animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <PieChart size={32} />
        </div>
        <div className={`absolute -bottom-16 -right-16 bg-white bg-opacity-20 rounded-full p-4 transition-all duration-1000 ${
          animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <TrendingUp size={32} />
        </div>
        
        <div className="bg-white rounded-full p-6 shadow-lg">
          <DollarSign size={64} className="text-blue-500" />
        </div>
      </div>
      
      <h1 className={`text-5xl font-bold mb-4 transition-all duration-700 ${
        animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        Expense Manager
      </h1>
      
      <p className={`text-xl max-w-md text-center text-white text-opacity-90 transition-all duration-700 ${
        animationStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        Track your finances, analyze spending patterns, and make smarter financial decisions
      </p>
      
      <div className={`mt-8 flex items-center transition-all duration-700 ${
        animationStage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
        <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse delay-100"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-200"></div>
      </div>
    </div>
  );
}