/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Sections/SectionPieceJointe.tsx
import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

import type { FicheNavetteService } from '../../Services/ficheNavette.service';

type Props = {
  service: FicheNavetteService;
  itemId?: number; // peut être undefined pour nouvelle création
  disabled?: boolean;
  pendingFiles?: File[]; // fichiers ajoutés avant enregistrement
  setPendingFiles?: (files: File[]) => void; // pour communiquer avec le parent
};

type Attachment = {
  FileName: string;
  ServerRelativeUrl: string;
};

export default function SectionPieceJointe({
  service,
  itemId,
  disabled,
  pendingFiles = [],
  setPendingFiles,
}: Props) {
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  // --- Chargement des pièces jointes existantes
  const loadAttachments = React.useCallback(async () => {
    if (!itemId) return;
    setLoading(true);
    try {
      const atts = await service.getAttachments(itemId);
      setAttachments(atts);
    } catch (e) {
      console.error('Erreur chargement pièces jointes', e);
    } finally {
      setLoading(false);
    }
  }, [service, itemId]);

  React.useEffect(() => {
    void loadAttachments();
  }, [loadAttachments]);

  // --- Ajout de fichiers (local only)
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setPendingFiles?.([...pendingFiles, ...newFiles]);
    e.target.value = ''; // réinitialise l'input
  };

  // --- Suppression d'une pièce jointe existante
  const handleDeleteExisting = async (name: string) => {
    if (!itemId) return;
    await service.deleteAttachment(itemId, name);
    await loadAttachments();
  };

  // --- Suppression d'un fichier ajouté mais pas encore enregistré
  const handleDeletePending = (file: File) => {
    setPendingFiles?.(pendingFiles.filter(f => f !== file));
  };

  return (
    <Box>
      <Typography variant="h6">Pièces jointes</Typography>

      {!disabled && (
            <>
            <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{
                mt: 1,
                mb: 1,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': {
                boxShadow: 4,
                backgroundColor: 'primary.dark',
                },
            }}
            disabled={disabled}
            >
            Ajouter un fichier
            <input type="file" hidden multiple onChange={handleAddFiles} />
            </Button>

            {pendingFiles.length > 0 && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
                {pendingFiles.length} fichier{pendingFiles.length > 1 ? 's' : ''} en attente
            </Typography>
            )}
        </>
        )}

      {loading ? (
        <Typography>Chargement...</Typography>
      ) : (
        <List>
          {/* fichiers existants */}
          {attachments.map(att => (
            <ListItem
              key={att.FileName}
              secondaryAction={
                !disabled && (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteExisting(att.FileName)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={
                  <Link href={att.ServerRelativeUrl} target="_blank" rel="noopener">
                    {att.FileName}
                  </Link>
                }
              />
            </ListItem>
          ))}

          {/* fichiers ajoutés mais non enregistrés */}
          {pendingFiles.map(file => (
            <ListItem
              key={file.name}
              secondaryAction={
                !disabled && (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePending(file)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText primary={file.name} />
            </ListItem>
          ))}

          {attachments.length === 0 && pendingFiles.length === 0 && (
            <ListItem>
              <ListItemText primary="Aucune pièce jointe" />
            </ListItem>
          )}
        </List>
      )}
    </Box>
  );
}
