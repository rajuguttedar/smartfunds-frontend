
export default function Footer() {
  return (
    <footer className="my-8 fixed font-suse-mono bottom-0 left-0 right-0 text-center text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3">
      © {new Date().getFullYear()} Finance App — All rights reserved.
    </footer>
  );
}
