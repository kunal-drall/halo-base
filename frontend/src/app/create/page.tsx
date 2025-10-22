'use client';

import { CreateCircleForm } from '@/components/circles/CreateCircleForm';
import { ContractIntegrationTest } from '@/components/ContractIntegrationTest';
import { useAccount } from 'wagmi';

export default function CreateCirclePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Create Lending Circle</h1>
          <p className="text-text-secondary">
            Set up a new lending circle with your preferred parameters
          </p>
        </div>

        {/* Contract Integration Status */}
        {isConnected && (
          <div className="mb-8">
            <ContractIntegrationTest />
          </div>
        )}

        {/* Create Circle Form */}
        <div className="max-w-2xl">
          <CreateCircleForm />
        </div>
      </div>
    </div>
  );
}

