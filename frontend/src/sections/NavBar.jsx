// The NavBar moved to components/layout. Legacy pages (Events, Team, Contact,
// Recruitment) still import it from here; Stage 4 hoists it into RootLayout
// and this shim is deleted.
export { default } from '../components/layout/NavBar';
