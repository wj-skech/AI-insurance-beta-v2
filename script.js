const { useState, useEffect } = React;

// 🔑 [설정]
const VALID_CODES = ["kb2025", "team01", "1234"]; 
const APP_NAME = "AI 간편 보장분석";

// [데이터]
const INITIAL_STANDARDS = {
    "사망(일반)": { min: 5000, rec: 10000 },
    "사망(재해)": { min: 10000, rec: 20000 },
    "사망(질병)": { min: 3000, rec: 5000 },
    "후유장해(50%~)": { min: 5000, rec: 10000 },
    "암 진단비": { min: 3000, rec: 5000 },
    "고액암 진단비": { min: 3000, rec: 5000 },
    "소액암 진단비": { min: 1000, rec: 2000 }, 
    "표적항암허가치료비": { min: 3000, rec: 5000 },
    "뇌혈관 진단비": { min: 2000, rec: 3000 },
    "뇌졸중 진단비": { min: 2000, rec: 3000 },
    "허혈성심장 진단비": { min: 2000, rec: 3000 },
    "급성심근경색": { min: 2000, rec: 3000 },
    "치매 진단비": { min: 1000, rec: 3000 },
    "질병 수술비": { min: 30, rec: 50 },
    "재해 수술비": { min: 50, rec: 100 },
    "질병 1-5종 수술": { min: 100, rec: 300 },
    "재해 1-5종 수술": { min: 100, rec: 300 },
    "질병 입원비": { min: 3, rec: 5 },
    "재해 입원비": { min: 3, rec: 5 },
    "간병인 사용": { min: 10, rec: 15 }
};
const COVERAGE_KEYS = Object.keys(INITIAL_STANDARDS);

// [컴포넌트] LifecycleTable
const LifecycleTable = ({ data, totalPremium }) => {
    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 min-w-[300px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap">시점</th>
                            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">예상 월 납입금</th>
                            <th scope="col" className="px-4 py-3 w-1/3 whitespace-nowrap">비중 (vs 현재)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            const percent = totalPremium > 0 ? Math.round((item.val / totalPremium) * 100) : 0;
                            const isRisk = percent > 30 && item.name !== '현재';
                            return (
                                <tr key={index} className="bg-white border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{item.name}</td>
                                    <td className="px-4 py-3 text-right font-mono whitespace-nowrap">{item.val.toLocaleString()}원</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 min-w-[50px]">
                                                <div className={`h-2.5 rounded-full ${isRisk ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${percent}%` }}></div>
                                            </div>
                                            <span className={`text-xs font-bold ${isRisk ? 'text-red-600' : 'text-gray-600'}`}>{percent}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// [컴포넌트] LoginScreen
const LoginScreen = ({ onLogin }) => {
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState('');
    const handleLogin = (e) => {
        e.preventDefault();
        if (VALID_CODES.includes(inputCode)) onLogin(inputCode);
        else setError('접속 코드가 올바르지 않습니다.');
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 relative">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm text-center animate-in border z-10">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-shield-halved text-2xl text-blue-600"></i>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">{APP_NAME}</h2>
                <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    <input type="password" placeholder="접속 코드" value={inputCode} onChange={(e)=>{setInputCode(e.target.value);setError('')}} className="w-full p-3 border rounded text-center tracking-widest text-lg"/>
                    {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 text-lg">접속하기</button>
                </form>
            </div>
            <div className="absolute bottom-6 text-gray-400 text-xs font-mono">Test Version. 1-1</div>
        </div>
    );
};

// [공용]
const Card = ({ children, className = "" }) => <div className={`card ${className}`}>{children}</div>;
const SectionTitle = ({ icon, title }) => (
    <h2 className="flex items-center text-lg font-bold text-slate-800 mb-4 border-b pb-2">
        <i className={`fa-solid ${icon} w-6 h-6 mr-2 text-blue-600 flex items-center justify-center`}></i> {title}
    </h2>
);

// [메인] App
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const savedCode = localStorage.getItem('kb_ins_code');
        if (savedCode && VALID_CODES.includes(savedCode)) setIsLoggedIn(true);
    }, []);
    const handleLogin = (code) => { localStorage.setItem('kb_ins_code', code); setIsLoggedIn(true); };
    const handleLogout = () => { if(confirm("로그아웃 하시겠습니까?")) { localStorage.removeItem('kb_ins_code'); setIsLoggedIn(false); } };

    const [activeTab, setActiveTab] = useState('input');
    const [profile, setProfile] = useState({ 
        name: '김철수', age: 52, income: 500, retireAge: 60, 
        historyCancer: '유', historyBrainHeart: '무', historyDementia: '무',
        isDriver: '유' 
    });
    
    const [contracts, setContracts] = useState([
        { id: 1, company: 'A생명', name: '종신보험', type: '비갱신', premium: 150000, payEndDate: '2035-01-01', maturityDate: '2090-01-01' },
        { id: 2, company: 'B화재', name: '건강보험', type: '갱신형', premium: 30000, payEndDate: '2045-01-01', maturityDate: '2045-01-01' },
    ]);
    const [coverages, setCoverages] = useState(() => {
        const initial = {};
        COVERAGE_KEYS.forEach(key => initial[key] = 0);
        initial["사망(일반)"] = 5000; initial["암 진단비"] = 1000;
        return initial;
    });
    const [checks, setChecks] = useState({ silson: '없음', driver: '무', fire: '무', liability: '무' });
    const [stdMode, setStdMode] = useState('rec');
    const [standards, setStandards] = useState(() => {
        const init = {};
        Object.keys(INITIAL_STANDARDS).forEach(k => { init[k] = { ...INITIAL_STANDARDS[k], user: 0 }; });
        return init;
    });
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => { calculateAnalysis(); }, [profile, contracts, coverages, checks, standards, stdMode]);

    const calculateAnalysis = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        
        // A. 재무
        const totalPremium = contracts.reduce((acc, cur) => acc + Number(cur.premium), 0);
        const incomeRatio = profile.income > 0 ? (totalPremium / (profile.income * 10000)) * 100 : 0;
        
        let totalRemaining = 0;
        let postRetirePremium = 0;
        const lifecyclePremiums = { current: totalPremium, age60: 0, age70: 0, age80: 0 };
        const retireYear = currentYear + (profile.retireAge - profile.age);

        contracts.forEach(cont => {
            if(!cont.payEndDate) return;
            const payEnd = new Date(cont.payEndDate);
            const payEndYear = payEnd.getFullYear();
            const monthsLeft = (payEndYear - currentYear) * 12 + (payEnd.getMonth() - today.getMonth());
            if (monthsLeft > 0) totalRemaining += (monthsLeft * cont.premium);
            if (payEndYear > retireYear) postRetirePremium += Number(cont.premium);
            const y60 = currentYear + (60 - profile.age);
            const y70 = currentYear + (70 - profile.age);
            const y80 = currentYear + (80 - profile.age);
            if (payEndYear >= y60) lifecyclePremiums.age60 += Number(cont.premium);
            if (payEndYear >= y70) lifecyclePremiums.age70 += Number(cont.premium);
            if (payEndYear >= y80) lifecyclePremiums.age80 += Number(cont.premium);
        });

        let riskStatus = "안정"; 
        let riskReason = "";
        if (incomeRatio > 15) { riskStatus = "위험"; riskReason = "소득 대비 보험료 과다 (15% 초과)"; }
        else if (totalPremium > 0 && postRetirePremium > (totalPremium * 0.3)) { riskStatus = "위험"; riskReason = `은퇴 후에도 현재 납입액의 ${Math.round((postRetirePremium/totalPremium)*100)}%를 부담해야 함`; }

        const gapAnalysis = [];
        COVERAGE_KEYS.forEach(key => {
            const stdItem = standards[key];
            let baseRec = stdMode === 'min' ? stdItem.min : (stdMode === 'rec' ? stdItem.rec : (stdItem.user > 0 ? stdItem.user : stdItem.rec));

            if (profile.age >= 60) baseRec = baseRec * 0.6;
            if (key.includes("암") && profile.historyCancer === '유') baseRec = baseRec * 1.5;
            if ((key.includes("뇌") || key.includes("심장") || key.includes("급성심근")) && profile.historyBrainHeart === '유') baseRec = baseRec * 1.5;
            if (key.includes("치매") && profile.historyDementia === '유') baseRec = baseRec * 1.5;

            const current = coverages[key];
            const gap = current - baseRec;
            let status = '적정';
            if (current < baseRec * 0.5) status = '부족'; else if (current < baseRec) status = '보통';
            
            gapAnalysis.push({ label: key, current, rec: baseRec, gap, status });
        });

        const checkResults = [];
        checkResults.push({ label: '실손의료비', status: checks.silson === '없음' ? '부족' : '양호' });
        if (profile.isDriver === '유') {
            checkResults.push({ label: '운전자(형사합의)', status: checks.driver === '무' ? '부족' : '양호' });
        } else {
            checkResults.push({ label: '운전자(형사합의)', status: '해당없음' });
        }
        checkResults.push({ label: '화재손해(주택)', status: checks.fire === '무' ? '부족' : '양호' });
        checkResults.push({ label: '일상배상책임', status: checks.liability === '무' ? '부족' : '양호' });

        setAnalysis({ totalPremium, incomeRatio, totalRemaining: Math.round(totalRemaining/10000), postRetirePremium, lifecyclePremiums, riskStatus, riskReason, gapAnalysis, checkResults });
    };

    const StatusBadge = ({ status }) => {
        const colors = { '안정':'bg-green-100 text-green-800', '적정':'bg-green-100 text-green-800', '충분':'bg-green-100 text-green-800', '양호':'bg-green-100 text-green-800', '완벽':'bg-green-100 text-green-800', '해당없음':'bg-gray-100 text-gray-600', '보통':'bg-yellow-100 text-yellow-800', '부족':'bg-red-100 text-red-800', '위험':'bg-red-100 text-red-800' };
        return <span className={`px-2 py-1 rounded text-xs font-bold ${colors[status] || 'bg-gray-100'} whitespace-nowrap`}>{status}</span>;
    };

    if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <header className="bg-slate-800 text-white p-4 shadow sticky top-0 z-50 mb-6 flex justify-between items-center">
                <h1 className="text-lg font-bold truncate"><i className="fa-solid fa-chart-line mr-2"></i>{APP_NAME}</h1>
                <div className="flex gap-2 shrink-0">
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded flex items-center">{new Date().toLocaleDateString()}</span>
                    <button onClick={handleLogout} className="text-xs bg-red-600 px-2 py-1 rounded no-print"><i className="fa-solid fa-power-off"></i></button>
                </div>
            </header>

            <div className="px-4 mb-4 flex gap-2 no-print tab-nav">
                {['input', 'standard', 'report'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab===tab ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-500 border'}`}>
                        {tab==='input'?'입력':tab==='standard'?'기준설정':'결과'}
                    </button>
                ))}
            </div>

            <div className="px-4">
                {activeTab === 'input' && (
                    <div className="space-y-4 animate-in">
                        <Card>
                            <SectionTitle icon="fa-user" title="고객 프로필" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[{l:'성명',k:'name',t:'text'},{l:'나이',k:'age',t:'number'},{l:'소득(만원)',k:'income',t:'number'},{l:'은퇴 나이',k:'retireAge',t:'number'}].map(f=>(
                                    <div key={f.k}><label className="text-xs text-gray-500 block mb-1">{f.l}</label><input type={f.t} value={profile[f.k]} onChange={e=>setProfile({...profile,[f.k]:f.t==='number'?Number(e.target.value):e.target.value})} className="w-full p-2 border rounded text-sm"/></div>
                                ))}
                                <div><label className="text-xs text-gray-500 block mb-1">운전 여부</label><select value={profile.isDriver} onChange={e=>setProfile({...profile,isDriver:e.target.value})} className="w-full p-2 border rounded text-sm"><option value="유">운전함 (유)</option><option value="무">운전안함 (무)</option></select></div>
                                <div><label className="text-xs text-gray-500 block mb-1">암 가족력</label><select value={profile.historyCancer} onChange={e=>setProfile({...profile,historyCancer:e.target.value})} className="w-full p-2 border rounded text-sm"><option value="유">유</option><option value="무">무</option></select></div>
                                <div><label className="text-xs text-gray-500 block mb-1">뇌/심 가족력</label><select value={profile.historyBrainHeart} onChange={e=>setProfile({...profile,historyBrainHeart:e.target.value})} className="w-full p-2 border rounded text-sm"><option value="유">유</option><option value="무">무</option></select></div>
                                <div><label className="text-xs text-gray-500 block mb-1">치매 가족력</label><select value={profile.historyDementia} onChange={e=>setProfile({...profile,historyDementia:e.target.value})} className="w-full p-2 border rounded text-sm"><option value="유">유</option><option value="무">무</option></select></div>
                            </div>
                        </Card>
                        <Card>
                            <SectionTitle icon="fa-file-contract" title="계약 리스트" />
                            <div className="space-y-3">
                                {contracts.map((cont, idx) => (
                                    <div key={cont.id} className="p-3 bg-slate-50 rounded border relative">
                                        <button onClick={() => setContracts(contracts.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><i className="fa-solid fa-times"></i></button>
                                        <div className="flex flex-col sm:flex-row gap-2 mb-2 pr-6">
                                            <input placeholder="보험사" value={cont.company} onChange={e=>{const n=[...contracts];n[idx].company=e.target.value;setContracts(n)}} className="w-full sm:w-1/3 p-1 text-sm border rounded" />
                                            <input placeholder="상품명" value={cont.name} onChange={e=>{const n=[...contracts];n[idx].name=e.target.value;setContracts(n)}} className="w-full sm:w-2/3 p-1 text-sm border rounded" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <div><label className="text-xs text-gray-500">월 보험료</label><input type="number" value={cont.premium} onChange={e=>{const n=[...contracts];n[idx].premium=Number(e.target.value);setContracts(n)}} className="w-full p-1 text-sm border rounded text-right" /></div>
                                            <div><label className="text-xs text-gray-500">납입종료</label><input type="date" value={cont.payEndDate} onChange={e=>{const n=[...contracts];n[idx].payEndDate=e.target.value;setContracts(n)}} className="w-full p-1 text-sm border rounded" /></div>
                                            <div><label className="text-xs text-blue-600 font-bold">보험만기</label><input type="date" value={cont.maturityDate} onChange={e=>{const n=[...contracts];n[idx].maturityDate=e.target.value;setContracts(n)}} className="w-full p-1 text-sm border rounded border-blue-200" /></div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => setContracts([...contracts, { id: Date.now(), company: '', name: '', type: '비갱신', premium: 0, payEndDate:'2040-01-01', maturityDate:'2090-01-01' }])} className="w-full py-2 bg-blue-50 text-blue-600 rounded font-bold text-sm">+ 계약 추가</button>
                            </div>
                        </Card>
                        <Card>
                            <SectionTitle icon="fa-shield-halved" title="보장 금액 입력 (만원)" />
                            <div className="h-80 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                {COVERAGE_KEYS.map(key => (
                                    <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100">
                                        <span className="text-sm text-gray-600 w-2/3 break-keep">{key}</span>
                                        <input type="number" value={coverages[key]} onChange={e=>setCoverages({...coverages,[key]:Number(e.target.value)})} className="w-24 p-1 border rounded text-right text-sm" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card>
                            <SectionTitle icon="fa-check-double" title="기타 보장 체크" />
                            <div className="space-y-2">
                                <div className="flex justify-between items-center"><span className="text-sm font-bold">실손의료비</span><select value={checks.silson} onChange={e=>setChecks({...checks,silson:e.target.value})} className="p-1 border rounded w-32 text-sm">{['없음','1세대','2세대','3세대','4세대'].map(o=><option key={o} value={o}>{o}</option>)}</select></div>
                                {[{k:'driver',l:'운전자(형사합의)'},{k:'fire',l:'화재손해(주택)'},{k:'liability',l:'일상배상책임'}].map(i=>(<div key={i.k} className="flex justify-between items-center"><span className="text-sm font-bold">{i.l}</span><select value={checks[i.k]} onChange={e=>setChecks({...checks,[i.k]:e.target.value})} className="p-1 border rounded w-32 text-sm"><option value="유">유</option><option value="무">무</option></select></div>))}
                            </div>
                        </Card>
                    </div>
                )}
                {activeTab === 'standard' && (
                    <div className="space-y-4 animate-in">
                        <Card>
                            <SectionTitle icon="fa-sliders" title="보장 기준 설정" />
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 bg-slate-100 p-3 rounded-lg">
                                {[{id:'min',l:'① 필수보장'},{id:'rec',l:'② 권장보장'},{id:'user',l:'③ 내 기준'}].map(opt=>(
                                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="stdMode" checked={stdMode===opt.id} onChange={()=>setStdMode(opt.id)} className="w-4 h-4 text-blue-600" />
                                        <span className={`text-sm font-bold ${stdMode===opt.id?'text-blue-600':'text-gray-500'}`}>{opt.l}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="space-y-2 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {COVERAGE_KEYS.map(key => (
                                    <div key={key} className={`border p-3 rounded ${stdMode==='user'?'bg-blue-50 border-blue-200':'bg-gray-50'}`}>
                                        <div className="font-bold text-sm mb-2">{key}</div>
                                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                            <div className={stdMode==='min'?'text-blue-600 font-bold':''}><span className="block text-gray-400">필수</span>{standards[key].min}</div>
                                            <div className={stdMode==='rec'?'text-blue-600 font-bold':''}><span className="block text-gray-400">권장</span>{standards[key].rec}</div>
                                            <div><span className="block text-gray-400">내기준</span><input type="number" value={standards[key].user||''} placeholder={standards[key].rec} onChange={e=>{const n={...standards};n[key]={...n[key],user:Number(e.target.value)};setStandards(n)}} className="w-full p-1 border rounded text-center" /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
                {activeTab === 'report' && analysis && (
                    <div className="space-y-6 animate-in" id="section-report">
                        <Card className="border-l-4 border-l-blue-600">
                            <SectionTitle icon="fa-coins" title="보험료 건전성 분석" />
                            <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded">
                                <div><span className="text-xs text-gray-500">종합 진단</span><div className={`text-xl font-bold ${analysis.riskStatus==='위험'?'text-red-600':'text-green-600'}`}>{analysis.riskStatus}</div></div>
                                <div className="text-right"><span className="text-xs text-gray-500">월 총 납입</span><div className="text-lg font-bold">{analysis.totalPremium.toLocaleString()}원</div></div>
                            </div>
                            {analysis.riskReason && <div className="bg-red-50 text-red-700 text-xs p-2 rounded mb-4 font-bold border border-red-100"><i className="fa-solid fa-triangle-exclamation mr-1"></i> {analysis.riskReason}</div>}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-gray-600">소득 대비 비중</span><span className={`font-bold ${analysis.incomeRatio > 15 ? 'text-red-600' : 'text-green-600'}`}>{analysis.incomeRatio.toFixed(1)}%</span></div>
                                <div className="w-full bg-gray-200 h-2 rounded-full"><div className={`h-2 rounded-full ${analysis.incomeRatio > 15 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min(analysis.incomeRatio, 100)}%`}}></div></div>
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t mt-2">
                                    <div className="text-right col-span-2"><p className="text-xs text-gray-500">앞으로 낼 돈 (잔여 할부금)</p><p className="font-bold text-red-600">{analysis.totalRemaining.toLocaleString()}만원</p></div>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <SectionTitle icon="fa-calendar-days" title="생애주기별 납입 예상" />
                            <LifecycleTable data={[{ name: '현재', val: analysis.lifecyclePremiums.current }, { name: '60세', val: analysis.lifecyclePremiums.age60 }, { name: '70세', val: analysis.lifecyclePremiums.age70 }, { name: '80세', val: analysis.lifecyclePremiums.age80 }]} totalPremium={analysis.totalPremium} />
                            <p className="text-xs text-gray-400 mt-2 text-center">* 납입종료일을 기준으로 정확히 계산되었습니다.</p>
                        </Card>
                        <Card>
                            <SectionTitle icon="fa-chart-pie" title="영역별 보장 분석" />
                            <div className="text-center text-xs text-gray-500 mb-3 font-bold bg-slate-100 p-2 rounded">
                                적용 기준: {stdMode==='min'?'① 필수보장':stdMode==='rec'?'② 권장보장':'③ 내 기준'}
                            </div>
                            <div className="space-y-0 divider-y divide-gray-100">
                                {analysis.gapAnalysis.map((item, idx) => (
                                    <div key={idx} className="py-3 border-b border-gray-100 last:border-0">
                                        <div className="flex justify-between items-center mb-1"><span className="font-bold text-gray-700 text-sm w-3/5 truncate">{item.label}</span><StatusBadge status={item.status} /></div>
                                        <div className="flex justify-between text-xs text-gray-500"><span>보유: {item.current.toLocaleString()}만</span><span>권장: {item.rec.toLocaleString()}만</span></div>
                                        {item.gap < 0 && <p className="text-xs text-red-500 font-bold text-right mt-1">{Math.abs(item.gap).toLocaleString()}만원 부족</p>}
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card>
                            <SectionTitle icon="fa-check-circle" title="기타 보장 체크 (결과)" />
                            <div className="space-y-0 divider-y divide-gray-100">
                                {analysis.checkResults.map((item, idx) => (
                                    <div key={idx} className="py-3 border-b border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-700 text-sm">{item.label}</span>
                                        <StatusBadge status={item.status} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg mb-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center"><i className="fa-solid fa-robot mr-2 text-yellow-400"></i> AI 종합 솔루션</h3>
                            <div className="space-y-3 text-sm leading-relaxed opacity-90">
                                <p><strong className="text-yellow-400">[재무]</strong> {analysis.riskStatus === '위험' ? `현재 보험료 상태는 '위험'입니다. ${analysis.riskReason} 상황이므로 조정이 시급합니다.` : '보험료 상태는 안정적입니다.'}</p>
                                <p><strong className="text-yellow-400">[보장]</strong> 기준({stdMode==='min'?'필수':stdMode==='rec'?'권장':'내설정'}) 대비 {analysis.gapAnalysis.filter(i=>i.status==='부족').length}개 항목이 부족합니다.</p>
                                <p><strong className="text-yellow-400">[기타]</strong> 
                                    {analysis.checkResults.find(i=>i.status==='부족') 
                                        ? ` ${analysis.checkResults.filter(i=>i.status==='부족').map(i=>i.label).join(', ')}이(가) 준비되지 않았습니다. 보완이 필요합니다.` 
                                        : ' 기타 보장도 빈틈없이 준비되어 있습니다.'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => window.print()} className="w-full py-4 bg-gray-800 text-white font-bold rounded-lg no-print hover:bg-gray-700 transition"><i className="fa-solid fa-print mr-2"></i> 리포트 PDF 저장</button>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);