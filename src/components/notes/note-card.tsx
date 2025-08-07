import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit, Trash2, Calendar } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

interface Note {
  note_id: string
  note_title: string
  note_content: string
  created_on: string
  last_update: string
}

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (noteId: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    const text = stripHtml(content)
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="p-4 bg-gradient-warm border-note-border shadow-note hover:shadow-elevated transition-all duration-300 cursor-pointer group">
        <div className="flex justify-between items-start mb-3">
          <h3 
            className="text-lg font-semibold text-foreground line-clamp-1 flex-1 pr-2"
            onClick={() => onEdit(note)}
          >
            {note.note_title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-note-border">
              <DropdownMenuItem onClick={() => onEdit(note)} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(note.note_id)} 
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div 
          className="text-muted-foreground text-sm mb-4 line-clamp-3"
          onClick={() => onEdit(note)}
        >
          {truncateContent(note.note_content)}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {format(new Date(note.last_update), 'MMM d, yyyy')}
        </div>
      </Card>
    </motion.div>
  )
}