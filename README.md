# DPW-NotesApp-Web
# Nurcahyani 25071104584 TI-C
tugas dpw membuat website berdasarkan studi kasus yang dipilih dan materi yang telah dipelajari


## Cross-platform UI consistency

Native form controls have been normalized with shared CSS styling so selects, buttons, text inputs, and date fields keep the app's existing visual language across operating systems. The existing Lucide React icons are retained; they are SVG-based and therefore render consistently across platforms. The date-picker popup itself is still provided by the browser/operating system, while its field appearance is normalized.


### Custom cross-platform UI controls

The note date field uses an in-app calendar popup, and category, sorting, and editor font controls use custom React dropdowns rather than native OS menus. Scrollbars use coordinated styling for WebKit browsers and Firefox. These controls retain the existing Noerlyst palette and visual style.
