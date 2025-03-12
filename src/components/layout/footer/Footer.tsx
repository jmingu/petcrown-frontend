export default function Footer() {
  return (
    <footer className="mt-12 bg-white border-t border-gray-200">
      <div className="global-wrapper text-center py-6">
        {/* 상단 정보 */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm border-b border-gray-300 pb-4">
          <div className="flex flex-col md:flex-row gap-3 text-gray-600">
            <a href="/terms" className="hover:underline">이용약관</a>
            <a href="/privacy" className="hover:underline">개인정보처리방침</a>
            <a href="/contact" className="hover:underline">문의하기</a>
          </div>

        </div>

        {/* 하단 회사 정보 */}
        <div className="text-xs mt-4 text-gray-500">
          <p>© 2025 PetCrown. All rights reserved.</p>
          <p>문의: <a href="mailto:support@petcrown.com" className="underline">support@petcrown.com</a></p>
        </div>
      </div>
    </footer>
  );
}
