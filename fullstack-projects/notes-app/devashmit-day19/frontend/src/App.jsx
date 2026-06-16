import{Routes,Route,Navigate}from"react-router-dom";
import NotesPage from"./pages/NotesPage";import NotePage from"./pages/NotePage";import NoteFormPage from"./pages/NoteFormPage";
export default function App(){return(<Routes><Route path="/" element={<Navigate to="/notes" replace/>}/><Route path="/notes" element={<NotesPage/>}/><Route path="/notes/new" element={<NoteFormPage/>}/><Route path="/notes/:id" element={<NotePage/>}/><Route path="/notes/:id/edit" element={<NoteFormPage/>}/></Routes>);}
