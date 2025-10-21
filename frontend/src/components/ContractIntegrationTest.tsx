'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useContractIntegration, useTestUSDC, useUserRegistration } from '@/hooks/useContractIntegration';
import { useAccount } from 'wagmi';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function ContractIntegrationTest() {
  const { isConnected } = useAccount();
  const { integrationStatus, isRegistered, totalCircles, usdcBalance } = useContractIntegration();
  const { mintTestUSDC } = useTestUSDC();
  const { registerUser } = useUserRegistration();
  const [isLoading, setIsLoading] = useState(false);

  const handleMintUSDC = async () => {
    setIsLoading(true);
    try {
      await mintTestUSDC();
    } catch (error) {
      console.error('Failed to mint USDC:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    setIsLoading(true);
    try {
      await registerUser();
    } catch (error) {
      console.error('Failed to register user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <span>Contract Integration Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Please connect your wallet to test contract integration.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {integrationStatus.contractsDeployed ? (
            <CheckCircle className="h-5 w-5 text-success" />
          ) : (
            <XCircle className="h-5 w-5 text-error" />
          )}
          <span>Contract Integration Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Status */}
        <div className="space-y-2">
          <h4 className="font-medium">Contract Status</h4>
          <div className="flex items-center space-x-2">
            <Badge variant={integrationStatus.contractsDeployed ? 'success' : 'error'}>
              {integrationStatus.contractsDeployed ? 'Deployed' : 'Not Deployed'}
            </Badge>
            {totalCircles !== undefined && (
              <span className="text-sm text-text-secondary">
                Total Circles: {Number(totalCircles)}
              </span>
            )}
          </div>
        </div>

        {/* User Status */}
        <div className="space-y-2">
          <h4 className="font-medium">User Status</h4>
          <div className="flex items-center space-x-2">
            <Badge variant={integrationStatus.userRegistered ? 'success' : 'secondary'}>
              {integrationStatus.userRegistered ? 'Registered' : 'Not Registered'}
            </Badge>
            <Badge variant={integrationStatus.hasUSDC ? 'success' : 'secondary'}>
              {integrationStatus.hasUSDC ? 'Has USDC' : 'No USDC'}
            </Badge>
          </div>
        </div>

        {/* USDC Balance */}
        {usdcBalance !== undefined && (
          <div className="space-y-2">
            <h4 className="font-medium">USDC Balance</h4>
            <p className="text-sm text-text-secondary">
              {Number(usdcBalance) / 1e6} USDC
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <h4 className="font-medium">Test Actions</h4>
          <div className="flex space-x-2">
            {!integrationStatus.userRegistered && (
              <Button
                onClick={handleRegisterUser}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Register User'
                )}
              </Button>
            )}
            {!integrationStatus.hasUSDC && (
              <Button
                onClick={handleMintUSDC}
                disabled={isLoading}
                size="sm"
                variant="secondary"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Mint Test USDC'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Errors */}
        {integrationStatus.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-error">Errors</h4>
            <div className="space-y-1">
              {integrationStatus.errors.map((error, index) => (
                <p key={index} className="text-sm text-error">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {integrationStatus.contractsDeployed && integrationStatus.userRegistered && integrationStatus.hasUSDC && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm text-success">
              ✅ All systems operational! You can now create circles and make contributions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
