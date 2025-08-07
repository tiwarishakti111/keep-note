import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Card } from '@/components/ui/card'
import { Save, X, FileText } from 'lucide-react'

interface Note {
  note_id?: string
  note_title: string
  note_content: string
  created_on?: string
  last_update?: string
}

interface NoteEditorProps {
  note?: Note | null
  onSave: (note: Omit<Note, 'note_id' | 'created_on' | 'last_update'>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function NoteEditor({ note, onSave, onCancel, loading }: NoteEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.note_title)
      setContent(note.note_content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [note])

  const handleSave = async () => {
    if (!title.trim()) return
    
    await onSave({
      note_title: title,
      note_content: content,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-warm border-note-border shadow-elevated">
        <div className="p-6 border-b border-note-border bg-secondary/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {note ? 'Edit Note' : 'Create New Note'}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={!title.trim() || loading}
                className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-note-border hover:bg-note-hover"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Note Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="text-lg font-medium bg-note border-note-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content
            </Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your note..."
              className="min-h-[400px]"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}