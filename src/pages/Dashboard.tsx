import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NoteCard } from '@/components/notes/note-card'
import { NoteEditor } from '@/components/notes/note-editor'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { Plus, Search, LogOut, User, FileText, BookOpen } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Note {
  note_id: string
  note_title: string
  note_content: string
  created_on: string
  last_update: string
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_update', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error: any) {
      toast({
        title: 'Error fetching notes',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const saveNote = async (noteData: { note_title: string; note_content: string }) => {
    setLoading(true)
    try {
      if (selectedNote) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('note_id', selectedNote.note_id)

        if (error) throw error
        toast({ title: 'Note updated successfully!' })
      } else {
        // Create new note
        const { error } = await supabase
          .from('notes')
          .insert({
            ...noteData,
            user_id: user?.id,
          })

        if (error) throw error
        toast({ title: 'Note created successfully!' })
      }
      
      await fetchNotes()
      setIsEditorOpen(false)
      setSelectedNote(null)
      setIsCreating(false)
    } catch (error: any) {
      toast({
        title: 'Error saving note',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('note_id', noteId)

      if (error) throw error
      
      setNotes(notes.filter(note => note.note_id !== noteId))
      toast({ title: 'Note deleted successfully!' })
    } catch (error: any) {
      toast({
        title: 'Error deleting note',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleCreateNote = () => {
    setSelectedNote(null)
    setIsCreating(true)
    setIsEditorOpen(true)
  }

  const handleEditNote = (note: Note) => {
    setSelectedNote(note)
    setIsCreating(false)
    setIsEditorOpen(true)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({ title: 'Signed out successfully!' })
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const filteredNotes = notes.filter(note =>
    note.note_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.note_content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="border-b border-note-border bg-note/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-foreground">NotesApp</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-note border-note-border focus:ring-primary"
                />
              </div>

              <Button
                onClick={handleCreateNote}
                className="bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-note-border">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No notes match your search for "${searchQuery}"`
                : 'Create your first note to get started with your digital notebook.'
              }
            </p>
            {!searchQuery && (
              <Button
                onClick={handleCreateNote}
                className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.note_id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={deleteNote}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Note Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <NoteEditor
            note={selectedNote}
            onSave={saveNote}
            onCancel={() => {
              setIsEditorOpen(false)
              setSelectedNote(null)
              setIsCreating(false)
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  )
}