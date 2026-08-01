import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { PostsProvider } from "./context/PostsContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { FeedPage } from "./pages/FeedPage";
import { NewPostPage } from "./pages/NewPostPage";
import { NewPostFormPage } from "./pages/NewPostFormPage";
import { ProfilePage } from "./pages/ProfilePage";

export default function App() { return <AuthProvider><PostsProvider><BrowserRouter><Routes>
  <Route path="/" element={<LandingPage/>}/><Route path="/entrar" element={<LoginPage/>}/><Route path="/cadastro" element={<SignupPage/>}/>
  <Route path="/feed" element={<ProtectedRoute><FeedPage/></ProtectedRoute>}/><Route path="/nova-publicacao" element={<ProtectedRoute><NewPostPage/></ProtectedRoute>}/><Route path="/nova-publicacao/:tipo" element={<ProtectedRoute><NewPostFormPage/></ProtectedRoute>}/>
  <Route path="/perfil" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
</Routes></BrowserRouter></PostsProvider></AuthProvider>; }
