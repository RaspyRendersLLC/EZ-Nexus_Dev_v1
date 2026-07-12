import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import { AlertCircle, LogIn, ChevronRight, Terminal, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '../app/components/ui/alert';
import usersData from '../data/users.json';
import rolesData from '../data/roles.json';
import departmentsData from '../data/departments.json';

export default function CyberpunkLogin() {
  const navigate = useNavigate();
  const { login, loginWithOffice365 } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [subDepartment, setSubDepartment] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedDept = departmentsData.find((d) => d.name === department);
  const subDepartments = selectedDept?.subDepartments || [];

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && !username) {
      setError('USERNAME REQUIRED');
      return;
    }
    if (currentStep === 2 && !role) {
      setError('ROLE SELECTION REQUIRED');
      return;
    }
    if (currentStep === 3 && !department) {
      setError('DEPARTMENT SELECTION REQUIRED');
      return;
    }
    if (currentStep === 4 && !subDepartment) {
      setError('SUB-DEPARTMENT SELECTION REQUIRED');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    const success = await login(username, role, department, subDepartment);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('AUTHENTICATION FAILED - VERIFY CREDENTIALS');
      setIsLoading(false);
    }
  };

  const handleOffice365Login = async () => {
    setError('');
    setIsLoading(true);

    const success = await loginWithOffice365();

    if (success) {
      navigate('/dashboard');
    } else {
      setError('OFFICE 365 AUTHENTICATION FAILED');
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-cyan-400 font-mono text-sm">
                &gt; USERNAME_INPUT
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="ENTER_USERNAME..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                className="bg-black/50 border-cyan-500/50 text-cyan-100 placeholder:text-cyan-900 focus:border-cyan-400 focus:ring-cyan-400/50 font-mono"
              />
              <p className="text-xs text-gray-500 font-mono">
                // Available: {usersData.map((u) => u.username).join(' | ')}
              </p>
            </div>

            <div className="pt-4 border-t border-cyan-500/20">
              <Button
                onClick={handleOffice365Login}
                variant="outline"
                className="w-full bg-purple-500/10 border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 font-mono"
                disabled={isLoading}
              >
                <Shield className="mr-2 h-4 w-4" />
                OFFICE_365_AUTH
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <Label htmlFor="role" className="text-cyan-400 font-mono text-sm">
              &gt; ROLE_SELECTION
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                id="role"
                className="bg-black/50 border-cyan-500/50 text-cyan-100 focus:border-cyan-400 focus:ring-cyan-400/50 font-mono"
              >
                <SelectValue placeholder="SELECT_ROLE..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/50">
                {rolesData.map((r) => (
                  <SelectItem key={r.id} value={r.name} className="text-cyan-100 font-mono">
                    {r.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <Label htmlFor="department" className="text-cyan-400 font-mono text-sm">
              &gt; DEPARTMENT_SELECTION
            </Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger
                id="department"
                className="bg-black/50 border-cyan-500/50 text-cyan-100 focus:border-cyan-400 focus:ring-cyan-400/50 font-mono"
              >
                <SelectValue placeholder="SELECT_DEPARTMENT..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/50">
                {departmentsData.map((d) => (
                  <SelectItem key={d.id} value={d.name} className="text-cyan-100 font-mono">
                    {d.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 4:
        return (
          <div className="space-y-3">
            <Label htmlFor="subDepartment" className="text-cyan-400 font-mono text-sm">
              &gt; SUB_DEPARTMENT_SELECTION
            </Label>
            <Select value={subDepartment} onValueChange={setSubDepartment}>
              <SelectTrigger
                id="subDepartment"
                className="bg-black/50 border-cyan-500/50 text-cyan-100 focus:border-cyan-400 focus:ring-cyan-400/50 font-mono"
              >
                <SelectValue placeholder="SELECT_SUB_DEPARTMENT..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/50">
                {subDepartments.map((sd) => (
                  <SelectItem key={sd.id} value={sd.name} className="text-cyan-100 font-mono">
                    {sd.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = ['USERNAME', 'ROLE', 'DEPARTMENT', 'SUB_DEPARTMENT'];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Glowing accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.03)_50%)] bg-[length:100%_4px]" />
      </div>

      {/* Main login container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Terminal-style header */}
          <div className="mb-6 border border-cyan-500/30 bg-black/80 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-mono text-sm">EZIT_ORCHESTRATOR.SYS</span>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono">
              SYSTEM_ACCESS
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-1">
              // AUTH_STEP [{currentStep}/4]: {stepTitles[currentStep - 1]}
            </p>
          </div>

          {/* Login card */}
          <div className="border border-cyan-500/30 bg-black/80 backdrop-blur-sm p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            {/* Progress indicators */}
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className="flex-1 h-1 bg-gray-800 relative overflow-hidden"
                >
                  {step <= currentStep && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-4 bg-red-500/10 border-red-500/50 text-red-400"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-mono text-xs">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {renderStep()}

                <div className="flex gap-2 mt-6">
                  {currentStep > 1 && currentStep < 5 && (
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 bg-black/50 border-gray-600 text-gray-400 hover:bg-gray-800 hover:border-gray-500 font-mono"
                    >
                      &lt; BACK
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-mono font-bold"
                    >
                      NEXT <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLogin}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-mono font-bold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          AUTHENTICATING...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          ACCESS_SYSTEM
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Corner decorations */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-500" />
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-purple-500" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-purple-500" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-500" />
        </motion.div>
      </div>

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}
