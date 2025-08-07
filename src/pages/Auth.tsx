import { useState } from 'react'
import { motion } from 'framer-motion'
import { AuthForm } from '@/components/auth/auth-form'
import { PenTool, BookOpen, Sparkles } from 'lucide-react'

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left space-y-6"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-elevated"
            >
              <PenTool className="h-8 w-8 text-white" />
            </motion.div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Your Ideas,
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Beautifully Organized
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-md">
              Capture thoughts, create masterpieces, and bring your ideas to life with our elegant note-taking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-3 p-4 bg-note rounded-lg border border-note-border"
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium text-sm">Rich Text Editor</p>
                <p className="text-xs text-muted-foreground">Format with ease</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-3 p-4 bg-note rounded-lg border border-note-border"
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium text-sm">Auto Save</p>
                <p className="text-xs text-muted-foreground">Never lose progress</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <AuthForm mode={mode} onToggleMode={() => setMode(mode === 'signin' ? 'signup' : 'signin')} />
        </div>
      </div>
    </div>
  )
}