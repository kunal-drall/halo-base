'use client';

import { Connected } from '@coinbase/onchainkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrustScoreDisplay } from '@/components/trust/TrustScoreDisplay';
import { ContractIntegrationTest } from '@/components/ContractIntegrationTest';
import { useAccount } from 'wagmi';
import { Users, Shield, DollarSign, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold">Halo Protocol</span>
            </div>
            <Button onClick={() => window.open('https://wallet.coinbase.com/', '_blank')}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Community Lending Circles
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Join peer-to-peer lending circles with trust-based credit scoring on Base blockchain. 
            Build your reputation and access credit without traditional banks.
          </p>
          
          {isConnected ? (
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="px-8">
                Browse Circles
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Create Circle
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button onClick={() => window.open('https://wallet.coinbase.com/', '_blank')}>
              Connect Wallet
            </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contract Integration Test */}
      {isConnected && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <ContractIntegrationTest />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Join Circles</CardTitle>
                <CardDescription>
                  Find lending circles that match your contribution amount and schedule
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Build Trust</CardTitle>
                <CardDescription>
                  Earn trust scores through reliable payments and DeFi activity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-accent-1/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-accent-1" />
                </div>
                <CardTitle>Make Contributions</CardTitle>
                <CardDescription>
                  Contribute to the pool and receive your payout when it&apos;s your turn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-accent-2/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent-2" />
                </div>
                <CardTitle>Earn Yield</CardTitle>
                <CardDescription>
                  Your contributions earn yield through Aave integration
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Score Section */}
      {isConnected && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Your Trust Score</h2>
              <Card>
                <CardContent className="p-8">
                  <TrustScoreDisplay showDetails={true} size="lg" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Join the future of community-based lending. No banks, no credit checks, 
            just trust and transparency.
          </p>
          {isConnected ? (
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="px-8">
                Browse Circles
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Create Circle
              </Button>
            </div>
          ) : (
            <Button onClick={() => window.open('https://wallet.coinbase.com/', '_blank')}>
              Connect Wallet
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="text-sm text-text-secondary">Halo Protocol</span>
            </div>
            <div className="text-sm text-text-secondary">
              Built on Base • Powered by Trust
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}