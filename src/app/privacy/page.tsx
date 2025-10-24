'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import CuteCard from '@/components/common/card/CuteCard';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              개인정보 처리방침
            </h1>
          </div>
          <p className="text-gray-600">
            PetCrown은 회원님의 개인정보를 소중히 보호합니다
          </p>
        </motion.div>

        {/* 내용 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CuteCard padding="lg">
            <div className="prose prose-sm max-w-none space-y-8">
              {/* 시행일자 */}
              <div className="text-sm text-gray-500 border-b pb-4">
                시행일자: 2024년 1월 1일
              </div>

              {/* 1. 개인정보의 수집 및 이용 목적 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. 개인정보의 수집 및 이용 목적
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  PetCrown('회사')은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
                  <li>서비스 제공: 반려동물 투표, 커뮤니티 서비스, 랭킹 서비스, 이벤트 참여 등의 서비스 제공</li>
                  <li>본인 확인 및 부정 이용 방지: 이메일 인증을 통한 본인 확인, 중복 투표 방지</li>
                  <li>고객 지원: 공지사항 전달, 고객 문의 응대</li>
                </ul>
              </section>

              {/* 2. 수집하는 개인정보 항목 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. 수집하는 개인정보 항목
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">필수 수집 항목</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>이메일 주소 (회원가입 및 본인 인증)</li>
                      <li>비밀번호 (암호화하여 저장)</li>
                      <li>이름</li>
                      <li>닉네임</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">선택 수집 항목 (회원 정보)</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>성별</li>
                      <li>생년월일</li>
                      <li>전화번호</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">반려동물 정보 (선택)</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>반려동물 이름, 종류, 품종, 성별, 생년월일</li>
                      <li>반려동물 사진</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">게시물 정보 (선택)</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>투표 게시물, 커뮤니티 게시물 및 댓글</li>
                      <li>게시물에 첨부된 이미지</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. 개인정보의 보유 및 이용기간 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. 개인정보의 보유 및 이용기간
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>회원 탈퇴 시까지 보유 및 이용</li>
                  <li>단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지 보유</li>
                  <li>법령에 따라 보존이 필요한 경우 해당 기간 동안 보관
                    <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                      <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                      <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                      <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                      <li>웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
                    </ul>
                  </li>
                </ul>
              </section>

              {/* 4. 개인정보의 제3자 제공 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. 개인정보의 제3자 제공
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                  <li>이용자가 사전에 동의한 경우</li>
                  <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                </ul>
              </section>

              {/* 5. 개인정보 처리의 위탁 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. 개인정보 처리의 위탁
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  회사는 현재 개인정보 처리 업무를 외부 업체에 위탁하지 않습니다. 향후 위탁이 필요한 경우, 사전에 위탁 업체명, 위탁 업무 내용 등을 공개하고 동의를 받겠습니다.
                </p>
              </section>

              {/* 6. 정보주체의 권리·의무 및 행사방법 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. 정보주체의 권리·의무 및 행사방법
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>개인정보 열람 요구</li>
                  <li>개인정보 정정·삭제 요구 (프로필 수정 페이지에서 직접 가능)</li>
                  <li>개인정보 처리 정지 요구</li>
                  <li>회원 탈퇴를 통한 개인정보 삭제</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  권리 행사는 개인정보보호법 시행규칙 별지 제8호 서식에 따라 작성 후 서면, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.
                </p>
              </section>

              {/* 7. 개인정보의 파기 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. 개인정보의 파기
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                </p>
                <div className="space-y-2 text-gray-700">
                  <div>
                    <span className="font-semibold">파기절차:</span> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 파기됩니다.
                  </div>
                  <div>
                    <span className="font-semibold">파기방법:</span> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.
                  </div>
                </div>
              </section>

              {/* 8. 개인정보의 안전성 확보조치 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. 개인정보의 안전성 확보조치
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>비밀번호 암호화: 이용자의 비밀번호는 암호화되어 저장 및 관리됩니다.</li>
                  <li>해킹 등에 대비한 기술적 대책: 백신프로그램을 이용하여 컴퓨터바이러스에 의한 피해를 방지하기 위한 조치를 취하고 있습니다.</li>
                  <li>개인정보 취급 직원의 최소화 및 교육: 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.</li>
                  <li>접근 통제: 개인정보를 처리하는 데이터베이스 시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있습니다.</li>
                </ul>
              </section>

              {/* 9. 개인정보 보호책임자 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. 개인정보 보호책임자
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-2">
                  <div className="text-gray-800">
                    <span className="font-semibold">개인정보 보호책임자</span>
                  </div>
                  <div className="text-gray-700">
                    이메일: kjkj173173@gmail.com
                  </div>
                  <div className="text-sm text-gray-600 mt-4">
                    기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• 개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
                    <li>• 개인정보분쟁조정위원회 (www.kopico.go.kr / 1833-6972)</li>
                    <li>• 대검찰청 사이버수사과 (www.spo.go.kr / 국번없이 1301)</li>
                    <li>• 경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</li>
                  </ul>
                </div>
              </section>

              {/* 10. 개인정보 처리방침 변경 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. 개인정보 처리방침 변경
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  이 개인정보 처리방침은 2024년 1월 1일부터 적용됩니다. 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
              </section>

              {/* 공고일자 */}
              <div className="text-sm text-gray-500 border-t pt-4">
                <div>공고일자: 2024년 1월 1일</div>
                <div>시행일자: 2024년 1월 1일</div>
              </div>
            </div>
          </CuteCard>
        </motion.div>

        {/* 뒤로가기 버튼 */}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
