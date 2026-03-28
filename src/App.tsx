import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainPage from "./pages/main";
import SubmitPage from "./pages/member/submit";
import SubmissionsPage from "./pages/manage/submissions";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/manage/submissions" element={<SubmissionsPage />} />
      </>
    ),
    {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
      },
    },
  );

  return (
    <RouterProvider future={{ v7_startTransition: true }} router={router} />
  );
}

export default App;