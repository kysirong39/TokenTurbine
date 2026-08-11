import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  FileCheck, 
  Users, 
  Play, 
  Sparkles, 
  Database, 
  Check, 
  ShieldAlert,
  Layers,
  Code2,
  Copy,
  CheckCheck,
  Search,
  BookOpen,
  FileCode,
  ArrowLeftRight,
  Binary,
  FileText,
  CheckSquare,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { FireblocksVault, StellarTx } from '../types';

interface IssuanceAndCustodyTabProps {
  vaults: FireblocksVault[];
  stellarTxs: StellarTx[];
  blockchainNetwork: string;
  custodyProvider: string;
}

export const IssuanceAndCustodyTab: React.FC<IssuanceAndCustodyTabProps> = ({
  vaults,
  stellarTxs,
  blockchainNetwork,
  custodyProvider
}) => {
  // Interactive Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSimStep, setCurrentSimStep] = useState(0); // 0 = idle, 1..5 = active steps
  const [mpcSignaturesCount, setMpcSignaturesCount] = useState(3);
  const [activeTab, setActiveTab] = useState<'workflow' | 'contracts' | 'code_inspector' | 'vaults'>('workflow');
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Code Inspector State: Selected Contract & Language Toggle (Rust vs Solidity vs Comparison)
  const [selectedContractKey, setSelectedContractKey] = useState<'rwa_token' | 'identity_registry' | 'compliance_rules' | 'escrow_waterfall'>('rwa_token');
  const [codeLanguage, setCodeLanguage] = useState<'rust' | 'solidity' | 'comparison'>('rust');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 5-Step Issuance & Approval Workflow Details
  const workflowSteps = [
    {
      step: 1,
      title: '1. Định Giá & Cấu Hình RWA',
      role: 'SPV & BIDV Investment Banking',
      description: 'Khởi tạo hồ sơ thẩm định tài sản turbine 50MW, lập cấu trúc SPV và mã hóa tổng cung 2.000.000 WIND Token (Định giá 200 tỷ VNĐ).',
      smartContractRole: 'Khởi tạo Smart Contract Master Token trên Soroban Stellar / EVM với tham số tổng cung và mệnh giá ban đầu.',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      icon: Database
    },
    {
      step: 2,
      title: '2. Kiểm Tra Whitelist ONCHAINID',
      role: 'Ngân hàng Đại lý & eKYC System',
      description: 'Xác minh danh tính nhà đầu tư qua chuẩn eKYC/AML. Hệ thống tự động cấp chứng thư số ONCHAINID đạt chuẩn ERC-3643.',
      smartContractRole: 'IdentityRegistry Contract rà soát ví nhận Token, từ chối ví chưa whitelisted hoặc thuộc danh sách đen.',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      icon: FileCheck
    },
    {
      step: 3,
      title: '3. Phê Duyệt MPC 3/3 Fireblocks',
      role: 'Hội đồng 3 Bên (SPV - BIDV - PwC)',
      description: 'Yêu cầu đồng phê duyệt bằng công nghệ phân mảnh khóa mật mã MPC (Multi-Party Computation) để xác nhận đủ điều kiện phát hành.',
      smartContractRole: 'Policy Engine kiểm tra đủ 3 Chữ ký MPC độc lập trước khi gửi giao dịch mint đến mạng lưới Blockchain.',
      badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
      icon: Key
    },
    {
      step: 4,
      title: '4. Thực Thi Smart Contract Mint',
      role: 'Soroban Rust & EVM Solidity',
      description: 'Smart Contract tự động Mint token mới, ghi nhận vào Sổ cái Blockchain minh bạch công khai.',
      smartContractRole: 'Smart Contract thi hành hàm mint(), phát sinh Event TokenMinted với hash công khai.',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      icon: Cpu
    },
    {
      step: 5,
      title: '5. Nạp Ví Lưu Ký & Escrow BIDV',
      role: 'Fireblocks Vault & BIDV Core Banking',
      description: 'Token được chuyển an toàn về Ví Master Custody Vault, đồng thời tiền góp vốn Fiat được khóa tại Tài khoản Escrow BIDV.',
      smartContractRole: 'TokenVault Bridge đồng bộ số dư ví lưu ký doanh nghiệp và kích hoạt luồng thanh toán cổ tức tự động.',
      badgeColor: 'border-teal-500/30 text-teal-300 bg-teal-500/10',
      icon: Lock
    }
  ];

  // Smart Contract Source Code Database in both Rust (Soroban) & Solidity (ERC-3643 EVM)
  const smartContractsSource = {
    rwa_token: {
      filenameRust: 'rwa_token.rs',
      filenameSol: 'RWAWindToken.sol',
      title: '1. RWA Wind Token Contract (Permissioned Security Token Standard)',
      purpose: 'Quản lý Mint Token bằng 3/3 Chữ ký MPC, kiểm tra Whitelist eKYC ONCHAINID, khóa chuyển nhượng khi xảy ra sự kiện Vỡ nợ Default SPV.',
      rustCode: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, IntoVal
};

/// ---------------------------------------------------------------------------------
/// SMART CONTRACT: RWA Wind Token (Soroban Native Rust - ERC-3643 Security Token Equivalent)
/// Dự án: Mã hóa tài sản Nhà máy Điện gió 50MW (SPV Năng Lượng Xanh BIDV)
/// ---------------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    Admin,                  // Địa chỉ Quản trị viên (BIDV Custody / SPV)
    IdentityRegistry,       // Địa chỉ Smart Contract ONCHAINID Identity Registry
    ComplianceEngine,       // Địa chỉ Smart Contract Compliance Engine
    TotalSupply,            // Tổng cung Token đã mint (2.000.000 WIND)
    Balance(Address),       // Mapping số dư Token của từng ví nhà đầu tư
    FrozenStatus(Address),  // Trạng thái phong tỏa (Frozen) từng ví cá nhân
    IsEmergencyLocked,      // Trạng thái khóa khẩn cấp toàn hệ thống (SPV Default Event)
    EscrowAccount,          // Địa chỉ Tài khoản Escrow phong tỏa tại BIDV Core Banking
}

#[contract]
pub struct RWAWindTokenContract;

#[contractimpl]
impl RWAWindTokenContract {
    /// 1. KHỞI TẠO SMART CONTRACT (INITIALIZE)
    /// Đặt các tham số quản trị ban đầu cho Tokenization Dự án Điện gió 50MW
    pub fn initialize(
        env: Env, 
        admin: Address, 
        identity_reg: Address, 
        compliance: Address,
        escrow: Address
    ) {
        // [Xác thực Quyền]: Yêu cầu chữ ký xác thực cryptographic của Admin khởi tạo
        admin.require_auth();

        // [Kiểm tra Trùng lặp]: Đảm bảo hợp đồng chưa từng được khởi tạo trước đó
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("LỖI BẢO MẬT: Smart Contract đã được khởi tạo trước đó!");
        }

        // [Lưu trữ Cấu hình]: Lưu các thông số quản trị vào Storage bền vững của Soroban
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::IdentityRegistry, &identity_reg);
        env.storage().instance().set(&DataKey::ComplianceEngine, &compliance);
        env.storage().instance().set(&DataKey::EscrowAccount, &escrow);
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
        env.storage().instance().set(&DataKey::IsEmergencyLocked, &false);

        // [Nhật ký Event]: Ghi sự kiện khởi tạo minh bạch lên Sổ cái Stellar Block
        env.events().publish((symbol_short!("init"), admin), symbol_short!("success"));
    }

    /// 2. HÀM MINT TOKEN VỚI NGƯỠNG PHÊ DUYỆT 3/3 MPC FIREBLOCKS (MINT WITH MPC)
    /// Chỉ cho phép mint token mới khi Hội đồng 3 bên (SPV - BIDV - PwC) duyệt đủ 3 Chữ ký
    pub fn mint_with_mpc(
        env: Env, 
        to: Address, 
        amount: i128, 
        mpc_sig_1: bool, // Mảnh khóa 1: SPV Năng Lượng Xanh
        mpc_sig_2: bool, // Mảnh khóa 2: Ngân hàng Lưu ký BIDV
        mpc_sig_3: bool  // Mảnh khóa 3: Đơn vị Kiểm toán PwC
    ) {
        // [Kiểm tra Admin]: Yêu cầu chữ ký của Admin hệ thống
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        // [Rào chắn MPC 3/3]: Bắt buộc 100% 3 chữ ký mật mã đa bên từ 3 tổ chức độc lập
        if !(mpc_sig_1 && mpc_sig_2 && mpc_sig_3) {
            panic!("LỖI AN NINH MPC: Không đủ 3/3 chữ ký MPC từ SPV, BIDV và PwC để phát hành!");
        }

        // [Rào chắn ONCHAINID]: Kiểm tra ví nhận đã hoàn tất eKYC/AML đạt chuẩn ERC-3643
        let identity_reg: Address = env.storage().instance().get(&DataKey::IdentityRegistry).unwrap();
        let is_whitelisted: bool = env.invoke_contract(
            &identity_reg, 
            &Symbol::new(&env, "is_whitelisted"), 
            (to.clone(),).into_val(&env)
        );

        if !is_whitelisted {
            panic!("LỖI COMPLIANCE: Ví nhận chưa hoàn tất xác thực chứng thư số ONCHAINID!");
        }

        // [Thực thi Mint]: Cập nhật Số dư ví và Tổng cung Token trên Blockchain
        let current_supply: i128 = env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);
        let current_balance: i128 = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or(0);

        let new_supply = current_supply + amount;
        let new_balance = current_balance + amount;

        env.storage().instance().set(&DataKey::TotalSupply, &new_supply);
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &new_balance);

        // [Báo cáo Blockchain]: Phát Event TokenMinted minh bạch trên Sổ cái Stellar
        env.events().publish((symbol_short!("mint"), to), amount);
    }

    /// 3. HÀM CHUYỂN NHƯỢNG TOKEN TUÂN THỦ DỰ ÁN (TRANSFER CHUẨN ERC-3643)
    /// Kiểm tra đồng thời Whitelist ONCHAINID & Quy tắc Tuân thủ Compliance Rules Engine
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        // [Xác thực Chủ ví]: Yêu cầu ví chuyển tiền ký duyệt bằng Private Key
        from.require_auth();

        // [Kiểm tra Khóa khẩn cấp]: Nếu SPV bị kích hoạt Vỡ nợ Default -> Dừng toàn bộ giao dịch
        let is_emergency: bool = env.storage().instance().get(&DataKey::IsEmergencyLocked).unwrap_or(false);
        if is_emergency {
            panic!("LỖI PHONG TỎA DỰ ÁN: Toàn bộ giao dịch bị đóng băng do Kích hoạt Sự kiện Vỡ nợ SPV!");
        }

        // [Kiểm tra Ví phong tỏa]: Rà soát trạng thái Frozen status riêng lẻ của ví gửi/ví nhận
        let is_from_frozen: bool = env.storage().persistent().get(&DataKey::FrozenStatus(from.clone())).unwrap_or(false);
        let is_to_frozen: bool = env.storage().persistent().get(&DataKey::FrozenStatus(to.clone())).unwrap_or(false);
        if is_from_frozen || is_to_frozen {
            panic!("LỖI TRẠNG THÁI VÍ: Ví gửi hoặc ví nhận đang trong trạng thái phong tỏa!");
        }

        // [Xác minh Whitelist eKYC]: Gọi Smart Contract IdentityRegistry xác minh ví nhận
        let identity_reg: Address = env.storage().instance().get(&DataKey::IdentityRegistry).unwrap();
        let is_to_valid: bool = env.invoke_contract(
            &identity_reg, 
            &Symbol::new(&env, "is_whitelisted"), 
            (to.clone(),).into_val(&env)
        );
        if !is_to_valid {
            panic!("LỖI COMPLIANCE: Ví nhận chưa được cấp chứng thư số định danh ONCHAINID!");
        }

        // [Xác minh Hạn mức Compliance]: Gọi Smart Contract ComplianceEngine kiểm tra hạn mức & lockup
        let compliance: Address = env.storage().instance().get(&DataKey::ComplianceEngine).unwrap();
        let is_compliant: bool = env.invoke_contract(
            &compliance, 
            &Symbol::new(&env, "check_transfer_compliance"), 
            (from.clone(), to.clone(), amount).into_val(&env)
        );
        if !is_compliant {
            panic!("LỖI QUY ĐỊNH PHÁP LÝ: Giao dịch vi phạm hạn mức cá nhân hoặc thời gian Lockup!");
        }

        // [Cập nhật Sổ cái Balance]: Trừ số dư ví chuyển & Cộng số dư ví nhận
        let from_bal: i128 = env.storage().persistent().get(&DataKey::Balance(from.clone())).unwrap_or(0);
        if from_bal < amount {
            panic!("LỖI SỐ DƯ: Ví gửi không đủ số dư WIND Token để thực hiện giao dịch!");
        }

        let to_bal: i128 = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or(0);

        env.storage().persistent().set(&DataKey::Balance(from.clone()), &(from_bal - amount));
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &(to_bal + amount));

        // [Event Chuyển nhượng]: Báo phát Event Transfer công khai
        env.events().publish((symbol_short!("transfer"), from, to), amount);
    }

    /// 4. HÀM KÍCH HOẠT PHONG TỎA KHẨN CẤP KHI VỠ NỢ SPV (TRIGGER DEFAULT LIQUIDATION)
    pub fn trigger_default_emergency_lock(env: Env, council_admin: Address) {
        council_admin.require_auth();
        env.storage().instance().set(&DataKey::IsEmergencyLocked, &true);
        env.events().publish((symbol_short!("default"), council_admin), symbol_short!("locked"));
    }

    /// 5. TRUY VẤN SỐ DƯ TOKEN (BALANCE_OF)
    pub fn balance_of(env: Env, owner: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(owner)).unwrap_or(0)
    }
}`,
      solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title RWAWindToken - Standard ERC-3643 Permissioned Token (EVM Implementation)
 * @notice Mã hóa Tài sản Điện gió 50MW - Ngân hàng BIDV Custody
 * @dev Thực thi đầy đủ bộ giao diện ERC-3643 (T-REX Framework by Tokeny) trên Ethereum/Polygon/Substrate EVM.
 */

interface IIdentityRegistry {
    function isWhitelisted(address _investor) external view returns (bool);
}

interface IComplianceEngine {
    function checkTransferCompliance(address _from, address _to, uint256 _amount) external view returns (bool);
}

contract RWAWindToken {
    string public constant name = "BIDV Green Wind Energy RWA Token";
    string public constant symbol = "WIND";
    uint8 public constant decimals = 0; // 1 WIND Token = 100.000 VNĐ (Mệnh giá gốc)
    
    uint256 public totalSupply;
    address public admin;              // BIDV Custody Administrator
    address public identityRegistry;   // ONCHAINID Identity Registry Sub-contract
    address public complianceEngine;   // Regulatory Rules Engine Sub-contract
    address public escrowAccount;      // Tài khoản Escrow phong tỏa tại BIDV Core Banking
    
    bool public isEmergencyLocked;     // Khóa khẩn cấp toàn bộ giao dịch khi SPV vỡ nợ (Default Event)
    
    mapping(address => uint256) private _balances;
    mapping(address => bool) public isFrozen;
    
    // Cấu trúc kiểm tra 3/3 Chữ ký Mật mã đa bên Fireblocks MPC
    struct MPCSignatures {
        bool spvSigned;      // Mảnh khóa 1: SPV Năng Lượng Xanh
        bool bidvSigned;     // Mảnh khóa 2: Ngân hàng Lưu ký BIDV
        bool pwcSigned;      // Mảnh khóa 3: Đơn vị Kiểm toán PwC
    }

    // Các Sự Kiện Blockchain On-Chain
    event Mint(address indexed to, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event FrozenStatusChanged(address indexed investor, bool status);
    event EmergencyLockTriggered(address indexed admin, string reason);

    // Custom Error Messages tiết kiệm Gas
    error Unauthorized();
    error IncompleteMPCSignatures();
    error NotWhitelisted(address investor);
    error NonCompliantTransfer();
    error InsufficientBalance();
    error SystemEmergencyLocked();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert Unauthorized();
        _;
    }

    modifier whenNotLocked() {
        if (isEmergencyLocked) revert SystemEmergencyLocked();
        _;
    }

    constructor(
        address _admin,
        address _identityRegistry,
        address _complianceEngine,
        address _escrowAccount
    ) {
        require(_admin != address(0), "Invalid Admin Address");
        admin = _admin;
        identityRegistry = _identityRegistry;
        complianceEngine = _complianceEngine;
        escrowAccount = _escrowAccount;
    }

    /**
     * @notice Mint Token mới với Ngưỡng Phê Duyệt 3/3 MPC Fireblocks
     */
    function mintWithMPC(
        address _to,
        uint256 _amount,
        MPCSignatures calldata _mpc
    ) external onlyAdmin whenNotLocked {
        // [1. Kiểm tra Ngưỡng MPC 3/3]
        if (!(_mpc.spvSigned && _mpc.bidvSigned && _mpc.pwcSigned)) {
            revert IncompleteMPCSignatures();
        }

        // [2. Kiểm tra eKYC Whitelist ONCHAINID]
        if (!IIdentityRegistry(identityRegistry).isWhitelisted(_to)) {
            revert NotWhitelisted(_to);
        }

        // [3. Cập nhật Số dư On-Chain]
        totalSupply += _amount;
        _balances[_to] += _amount;

        emit Mint(_to, _amount);
        emit Transfer(address(0), _to, _amount);
    }

    /**
     * @notice Chuyển nhượng Token chuẩn ERC-3643 kiểm tra eKYC & Compliance Engine
     */
    function transfer(address _to, uint256 _amount) external whenNotLocked returns (bool) {
        address sender = msg.sender;

        if (isFrozen[sender] || isFrozen[_to]) revert Unauthorized();
        if (_balances[sender] < _amount) revert InsufficientBalance();

        // Rào chắn 1: Rà soát Whitelist eKYC ONCHAINID ví nhận
        if (!IIdentityRegistry(identityRegistry).isWhitelisted(_to)) {
            revert NotWhitelisted(_to);
        }

        // Rào chắn 2: Thực thi Compliance Engine (Giới hạn <100 NĐT cá nhân, Lockup 12 tháng, Daily Cap)
        if (!IComplianceEngine(complianceEngine).checkTransferCompliance(sender, _to, _amount)) {
            revert NonCompliantTransfer();
        }

        _balances[sender] -= _amount;
        _balances[_to] += _amount;

        emit Transfer(sender, _to, _amount);
        return true;
    }

    /**
     * @notice Khóa khẩn cấp toàn bộ hợp đồng khi SPV chậm trả nợ / vỡ nợ Default
     */
    function triggerDefaultEmergencyLock() external onlyAdmin {
        isEmergencyLocked = true;
        emit EmergencyLockTriggered(msg.sender, "SPV Default Event - Escrow Liquidation Activated");
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return _balances[_owner];
    }
}`,
      comparison: {
        memorySafety: 'Soroban (Rust) cấm con trỏ tự do và tự động quản lý bộ nhớ compile-time qua Borrow Checker. Solidity có nguy cơ Buffer Overflow/Reentrancy nếu không xài ReentrancyGuard.',
        authorizationModel: 'Soroban sử dụng require_auth() cấp hệ điều hành với chữ ký mật mã ed25519 gắn liền. Solidity phụ thuộc vào msg.sender và cẩn trọng với tx.origin Phishing.',
        storageCost: 'Soroban phân tách Instance Storage (Cố định) và Persistent Storage (Số dư ví) với chi phí TTL Rent rõ ràng. Solidity lưu Storage trong Ethereum State Trie với chi phí gas SSTORE đắt đỏ.',
        standards: 'Rust Soroban định nghĩa Custom Structs/Enums linh hoạt, trong khi Solidity EVM dùng chuẩn chuẩn hóa ERC-3643 (T-REX standard by Tokeny).'
      }
    },
    identity_registry: {
      filenameRust: 'identity_registry.rs',
      filenameSol: 'IdentityRegistry.sol',
      title: '2. ONCHAINID Identity Registry Contract (ERC-3643 Sub-contract)',
      purpose: 'Quản lý dữ liệu eKYC/AML, chứng thư số, mã định danh thuế và phân loại nhà đầu tư (Cá nhân / Tổ chức / Nước ngoài).',
      rustCode: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String
};

/// ---------------------------------------------------------------------------------
/// SMART CONTRACT: ONCHAINID Identity Registry (Soroban Rust Implementation)
/// Quản lý Bảng Chứng thư Định danh Số eKYC/AML Nhà Đầu Tư RWA
/// ---------------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct IdentityClaim {
    pub investor_address: Address,  // Địa chỉ ví Blockchain của Nhà đầu tư
    pub national_id_hash: String,    // Hash định danh Căn cước công dân / Mã số thuế
    pub country_code: u32,           // Mã quốc gia theo tiêu chuẩn ISO (704 = Việt Nam)
    pub investor_type: u32,          // 1 = Cá nhân, 2 = Định chế Tài chính, 3 = NĐT Nước ngoài
    pub is_verified: bool,           // Trạng thái đã hoàn tất xác thực eKYC bởi BIDV Agent
    pub expiry_timestamp: u64,       // Thời điểm hết hạn chứng thư số (Cần gia hạn định kỳ)
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    Admin,                       // Địa chỉ Ngân hàng đại lý eKYC (BIDV Agent)
    InvestorClaim(Address),      // Mapping Ví -> Cấu trúc Chứng thư IdentityClaim
}

#[contract]
pub struct IdentityRegistryContract;

#[contractimpl]
impl IdentityRegistryContract {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn register_identity(
        env: Env,
        investor: Address,
        national_id_hash: String,
        country_code: u32,
        investor_type: u32,
        validity_days: u64
    ) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let current_time = env.ledger().timestamp();
        let expiry = current_time + (validity_days * 86400);

        let claim = IdentityClaim {
            investor_address: investor.clone(),
            national_id_hash,
            country_code,
            investor_type,
            is_verified: true,
            expiry_timestamp: expiry,
        };

        env.storage().persistent().set(&DataKey::InvestorClaim(investor.clone()), &claim);
        env.events().publish((symbol_short!("kyc_reg"), investor), true);
    }

    pub fn is_whitelisted(env: Env, investor: Address) -> bool {
        let claim_opt: Option<IdentityClaim> = env.storage().persistent().get(&DataKey::InvestorClaim(investor));

        match claim_opt {
            Some(claim) => {
                let current_time = env.ledger().timestamp();
                claim.is_verified && (claim.expiry_timestamp > current_time)
            },
            None => false
        }
    }

    pub fn get_investor_type(env: Env, investor: Address) -> u32 {
        let claim: IdentityClaim = env.storage().persistent().get(&DataKey::InvestorClaim(investor)).unwrap();
        claim.investor_type
    }
}`,
      solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title IdentityRegistry - ONCHAINID Identity Registry (EVM Solidity)
 * @notice Lưu trữ & xác minh chứng thư số định danh eKYC/AML của Nhà đầu tư RWA
 * @dev Đạt chuẩn ERC-3643 ONCHAINID Framework.
 */

contract IdentityRegistry {
    address public admin; // BIDV eKYC Agent Authority

    struct IdentityClaim {
        address investorAddress;  // Địa chỉ ví Blockchain của Nhà đầu tư
        bytes32 nationalIdHash;   // Hash Căn cước công dân / Mã số thuế
        uint16 countryCode;       // Mã ISO quốc gia (704 = Việt Nam)
        uint8 investorType;       // 1 = Cá nhân, 2 = Định chế Tài chính, 3 = NĐT Nước ngoài
        bool isVerified;          // Đã duyệt xác minh eKYC thành công
        uint64 expiryTimestamp;   // Thời điểm hết hạn chứng thư số
    }

    mapping(address => IdentityClaim) private _claims;

    event IdentityRegistered(address indexed investor, bytes32 nationalIdHash, uint8 investorType);
    event IdentityRevoked(address indexed investor);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Unauthorized: Only BIDV eKYC Admin");
        _;
    }

    constructor(address _admin) {
        require(_admin != address(0), "Invalid Admin Address");
        admin = _admin;
    }

    /**
     * @notice Đăng ký hoặc gia hạn chứng thư eKYC cho nhà đầu tư
     */
    function registerIdentity(
        address _investor,
        bytes32 _nationalIdHash,
        uint16 _countryCode,
        uint8 _investorType,
        uint64 _validityDays
    ) external onlyAdmin {
        uint64 expiry = uint64(block.timestamp) + (_validityDays * 86400);

        _claims[_investor] = IdentityClaim({
            investorAddress: _investor,
            nationalIdHash: _nationalIdHash,
            countryCode: _countryCode,
            investorType: _investorType,
            isVerified: true,
            expiryTimestamp: expiry
        });

        emit IdentityRegistered(_investor, _nationalIdHash, _investorType);
    }

    /**
     * @notice Rà soát tự động tính hợp lệ eKYC trước mọi giao dịch chuyển nhượng
     */
    function isWhitelisted(address _investor) external view returns (bool) {
        IdentityClaim memory claim = _claims[_investor];
        return (claim.isVerified && claim.expiryTimestamp > block.timestamp);
    }

    /**
     * @notice Truy vấn phân loại loại hình nhà đầu tư
     */
    function getInvestorType(address _investor) external view returns (uint8) {
        return _claims[_investor].investorType;
    }
}`,
      comparison: {
        memorySafety: 'Trong Solidity, struct được truy xuất dạng storage/memory pointer. Trong Rust Soroban, Option<IdentityClaim> hỗ trợ pattern-matching tuyệt đối an toàn chống Null Pointer.',
        authorizationModel: 'Solidity dùng modifier onlyAdmin(), Rust Soroban dùng admin.require_auth() xác thực mật mã cấp chuỗi.',
        storageCost: 'Rust Soroban lưu trữ bằng persistent storage key có chỉ số thời gian TTL. Solidity lưu trong mapping cố định trên EVM Trie.',
        standards: 'Cả 2 đều đáp ứng tiêu chuẩn chứng thư số ONCHAINID (ERC-3643 Standard).'
      }
    },
    compliance_rules: {
      filenameRust: 'compliance_rules.rs',
      filenameSol: 'ComplianceRules.sol',
      title: '3. Compliance Rules Engine Contract (Regulatory Control)',
      purpose: 'Thực thi các quy định pháp lý: Giới hạn <100 nhà đầu tư cá nhân, Lockup 12 tháng sơ cấp và Hạn mức 5 tỷ VNĐ/ngày.',
      rustCode: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env
};

/// ---------------------------------------------------------------------------------
/// SMART CONTRACT: Compliance Rules Engine (Soroban Rust Regulatory Control)
/// Tự động hóa rào chắn pháp lý theo Nghị định/Thông tư phát hành chứng khoán riêng lẻ
/// ---------------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    MaxRetailInvestors,       // Hạn mức tối đa số lượng nhà đầu tư cá nhân (< 100 người)
    CurrentRetailCount,       // Số lượng NĐT cá nhân hiện tại đang nắm giữ token
    LockupEndTime,            // Thời điểm kết thúc giai đoạn hạn chế chuyển nhượng Lockup (12 tháng)
    DailyTransferLimitVND,    // Hạn mức giao dịch tối đa/ngày (5.000.000.000 VNĐ)
}

#[contract]
pub struct ComplianceRulesContract;

#[contractimpl]
impl ComplianceRulesContract {
    pub fn initialize(env: Env, lockup_months: u64, max_retail: u32) {
        let current_time = env.ledger().timestamp();
        let lockup_seconds = lockup_months * 30 * 86400;

        env.storage().instance().set(&DataKey::MaxRetailInvestors, &max_retail);
        env.storage().instance().set(&DataKey::CurrentRetailCount, &1u32);
        env.storage().instance().set(&DataKey::LockupEndTime, &(current_time + lockup_seconds));
        env.storage().instance().set(&DataKey::DailyTransferLimitVND, &5_000_000_000i128);
    }

    pub fn check_transfer_compliance(
        env: Env, 
        _from: Address, 
        _to: Address, 
        amount_tokens: i128
    ) -> bool {
        let current_time = env.ledger().timestamp();
        let lockup_end: u64 = env.storage().instance().get(&DataKey::LockupEndTime).unwrap_or(0);

        // [Quy tắc 1: Kiểm tra Lockup Sơ cấp]: Trong 12 tháng đầu, cấm chuyển nhượng tự do
        if current_time < lockup_end {
            return false;
        }

        // [Quy tắc 2: Giới hạn Hạn mức Giao dịch]: Không quá 5 tỷ VNĐ/ngày
        let transfer_value_vnd = amount_tokens * 100_000; // 1 WIND = 100.000 VNĐ
        let limit_vnd: i128 = env.storage().instance().get(&DataKey::DailyTransferLimitVND).unwrap_or(5_000_000_000);

        if transfer_value_vnd > limit_vnd {
            return false;
        }

        // [Quy tắc 3: Kiểm tra Số lượng NĐT Cá nhân]: Tổng số NĐT luôn < 100 người
        let current_retail: u32 = env.storage().instance().get(&DataKey::CurrentRetailCount).unwrap_or(1);
        let max_retail: u32 = env.storage().instance().get(&DataKey::MaxRetailInvestors).unwrap_or(100);

        if current_retail > max_retail {
            return false;
        }

        true
    }
}`,
      solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title ComplianceRules - EVM Regulatory Compliance Engine
 * @notice Tự động hóa rào chắn pháp lý theo quy định Ủy ban Chứng khoán & Ngân hàng Nhà nước
 * @dev Implement giao diện ICompliance chuẩn ERC-3643.
 */

contract ComplianceRules {
    address public admin;
    
    uint32 public maxRetailInvestors = 100;       // Giới hạn < 100 NĐT cá nhân theo Thông tư
    uint32 public currentRetailCount = 1;
    uint256 public lockupEndTime;                  // Thời gian đóng băng chuyển nhượng sơ cấp 12 tháng
    uint256 public dailyTransferLimitVND = 5_000_000_000; // Daily Cap 5 Tỷ VNĐ

    modifier onlyAdmin() {
        require(msg.sender == admin, "Unauthorized Compliance Admin");
        _;
    }

    constructor(address _admin, uint256 _lockupMonths) {
        admin = _admin;
        lockupEndTime = block.timestamp + (_lockupMonths * 30 * 86400);
    }

    /**
     * @notice Hàm kiểm tra thời gian thực (Real-time check) trước mọi lệnh Transfer
     */
    function checkTransferCompliance(
        address /*_from*/,
        address /*_to*/,
        uint256 _amountTokens
    ) external view returns (bool) {
        // [Rào chắn 1: Thời gian Lockup 12 Tháng]
        if (block.timestamp < lockupEndTime) {
            return false;
        }

        // [Rào chắn 2: Hạn mức Giao dịch 5 Tỷ VNĐ/ngày]
        uint256 transferValueVND = _amountTokens * 100_000; // Mệnh giá 1 Token = 100k VNĐ
        if (transferValueVND > dailyTransferLimitVND) {
            return false;
        }

        // [Rào chắn 3: Giới hạn Số lượng <100 NĐT Cá nhân]
        if (currentRetailCount > maxRetailInvestors) {
            return false;
        }

        return true;
    }
}`,
      comparison: {
        memorySafety: 'Soroban Rust quản lý quy đổi số nguyên lớn i128 an toàn compile-time. Solidity v0.8+ tích hợp sẵn SafeMath phòng ngừa Overflow.',
        authorizationModel: 'Tích hợp mô hình Rule Engine độc lập giúp dễ dàng nâng cấp quy định pháp lý (Upgradeable Compliance Module).',
        storageCost: 'Chi phí tính toán kiểm tra logic thấp trên cả 2 mạng nhờ thiết kế View Method không làm thay đổi State.',
        standards: 'Được thiết kế đáp ứng quy định Phát hành Chứng khoán Riêng lẻ của Bộ Tài chính & Ủy ban Chứng khoán Việt Nam.'
      }
    },
    escrow_waterfall: {
      filenameRust: 'escrow_waterfall_bridge.rs',
      filenameSol: 'BIDVEscrowWaterfallBridge.sol',
      title: '4. BIDV Core Banking Escrow & Cashflow Waterfall Bridge Contract',
      purpose: 'Tự động nhận doanh thu EVN mua điện, trích thu chi O&M, Thuế, Nợ gốc lãi BIDV và phân bổ cổ tức tự động cho từng WIND Token.',
      rustCode: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env
};

/// ---------------------------------------------------------------------------------
/// SMART CONTRACT: BIDV Escrow & Cashflow Waterfall Bridge (Soroban Rust)
/// Kết nối Trực tiếp Tài khoản Phong tỏa BIDV với Smart Contract Chia Cổ Tức
/// ---------------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct WaterfallDistribution {
    pub total_evn_revenue_vnd: i128,   // Tổng tiền EVN thanh toán vào Escrow
    pub om_cost_vnd: i128,             // Chi phí Vận hành O&M (Ưu tiên 1 - 15%)
    pub tax_and_fees_vnd: i128,        // Thuế & Phí Nhà nước (Ưu tiên 2 - 10%)
    pub bank_debt_service_vnd: i128,   // Trả nợ gốc lãi BIDV (Ưu tiên 3 - 40%)
    pub investor_dividend_vnd: i128,   // Dòng tiền cổ tức NĐT WIND (Ưu tiên 4 - 35%)
    pub dividend_per_token_vnd: i128,  // Cổ tức thực nhận chia trên 1 WIND Token
    pub timestamp: u64,                // Thời điểm thực thi Waterfall
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    Admin,                         // BIDV Settlement Officer Address
    TotalTokensIssued,            // Tổng cung 2.000.000 WIND Token
    LastDistribution,             // Thông tin đợt phân bổ cổ tức mới nhất
    ClaimedDividends(Address),    // Nhật ký lịch sử ví NĐT đã rút cổ tức
}

#[contract]
pub struct EscrowWaterfallBridgeContract;

#[contractimpl]
impl EscrowWaterfallBridgeContract {
    pub fn initialize(env: Env, admin: Address, total_tokens: i128) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalTokensIssued, &total_tokens);
    }

    pub fn process_evn_payment(env: Env, total_revenue_vnd: i128) -> WaterfallDistribution {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        // [Tự động tính toán Tỷ lệ Waterfall Thác Thu Nhập]:
        let om_cost = (total_revenue_vnd * 15) / 100;         // 15% Chi phí Vận hành O&M
        let tax_fees = (total_revenue_vnd * 10) / 100;        // 10% Thuế & Phí Nhà nước
        let bank_debt = (total_revenue_vnd * 40) / 100;       // 40% Trả nợ vay BIDV
        let investor_div = (total_revenue_vnd * 35) / 100;    // 35% Cổ tức dành cho NĐT

        let total_tokens: i128 = env.storage().instance().get(&DataKey::TotalTokensIssued).unwrap_or(2_000_000);
        let div_per_token = investor_div / total_tokens;

        let dist = WaterfallDistribution {
            total_evn_revenue_vnd: total_revenue_vnd,
            om_cost_vnd: om_cost,
            tax_and_fees_vnd: tax_fees,
            bank_debt_service_vnd: bank_debt,
            investor_dividend_vnd: investor_div,
            dividend_per_token_vnd: div_per_token,
            timestamp: env.ledger().timestamp(),
        };

        env.storage().instance().set(&DataKey::LastDistribution, &dist);
        env.events().publish((symbol_short!("waterfall"), admin), total_revenue_vnd);

        dist
    }

    pub fn claim_dividend(env: Env, investor: Address, token_balance: i128) -> i128 {
        investor.require_auth();
        let dist: WaterfallDistribution = env.storage().instance().get(&DataKey::LastDistribution).unwrap();
        
        let payout_vnd = token_balance * dist.dividend_per_token_vnd;
        env.storage().persistent().set(&DataKey::ClaimedDividends(investor.clone()), &payout_vnd);
        env.events().publish((symbol_short!("payout"), investor), payout_vnd);

        payout_vnd
    }
}`,
      solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title BIDVEscrowWaterfallBridge - Banking Cashflow Waterfall Engine
 * @notice Kết nối Tài khoản Escrow BIDV & Phân bổ tự động dòng tiền mua điện từ Tập đoàn EVN
 * @dev Tự động thực thi Thác Thanh Toán (Waterfall Priority Payment) theo đúng Bản cáo bạch SPV.
 */

contract BIDVEscrowWaterfallBridge {
    address public settlementOfficer; // Cán bộ Thanh toán BIDV Core Banking
    uint256 public totalTokensIssued = 2_000_000;

    struct WaterfallDistribution {
        uint256 totalEVNRevenueVND;   // Doanh thu EVN chuyển về Escrow (ví dụ 10 Tỷ VNĐ)
        uint256 omCostVND;             // 15% Chi phí Vận hành & Bảo trì O&M
        uint256 taxAndFeesVND;        // 10% Thuế & Phí Nghĩa vụ Ngân sách
        uint256 bankDebtServiceVND;   // 40% Trả nợ gốc lãi Ngân hàng BIDV
        uint256 investorDividendVND;   // 35% Cổ tức dành cho NĐT sở hữu WIND Token
        uint256 dividendPerTokenVND;  // Cổ tức phân bổ trên mỗi WIND Token
        uint256 timestamp;            // Thời điểm chốt sổ Waterfall
    }

    WaterfallDistribution public lastDistribution;
    mapping(address => uint256) public claimedDividends;

    event WaterfallProcessed(uint256 totalRevenue, uint256 investorDividend, uint256 dividendPerToken);
    event DividendClaimed(address indexed investor, uint256 payoutAmountVND);

    modifier onlySettlementOfficer() {
        require(msg.sender == settlementOfficer, "Unauthorized: Only BIDV Settlement Officer");
        _;
    }

    constructor(address _officer) {
        require(_officer != address(0), "Invalid Officer Address");
        settlementOfficer = _officer;
    }

    /**
     * @notice Thực thi Phân bổ Thác Thu Nhập Waterfall khi EVN thanh toán tiền điện
     */
    function processEVNPayment(uint256 _totalRevenueVND) external onlySettlementOfficer returns (WaterfallDistribution memory) {
        require(_totalRevenueVND > 0, "Revenue must be greater than zero");

        // [Thuật toán Thác Thanh Toán Waterfall - 4 Tầng Ưu Tiên]
        uint256 omCost = (_totalRevenueVND * 15) / 100;         // Ưu tiên 1: 15% O&M
        uint256 taxFees = (_totalRevenueVND * 10) / 100;        // Ưu tiên 2: 10% Thuế
        uint256 bankDebt = (_totalRevenueVND * 40) / 100;       // Ưu tiên 3: 40% Nợ BIDV
        uint256 investorDiv = (_totalRevenueVND * 35) / 100;    // Ưu tiên 4: 35% Cổ tức NĐT

        uint256 divPerToken = investorDiv / totalTokensIssued;

        lastDistribution = WaterfallDistribution({
            totalEVNRevenueVND: _totalRevenueVND,
            omCostVND: omCost,
            taxAndFeesVND: taxFees,
            bankDebtServiceVND: bankDebt,
            investorDividendVND: investorDiv,
            dividendPerTokenVND: divPerToken,
            timestamp: block.timestamp
        });

        emit WaterfallProcessed(_totalRevenueVND, investorDiv, divPerToken);
        return lastDistribution;
    }

    /**
     * @notice Tự động rút/nhận cổ tức về ví Fiat VND cá nhân
     */
    function claimDividend(uint256 _tokenBalance) external returns (uint256) {
        require(lastDistribution.dividendPerTokenVND > 0, "No active dividend distribution");

        uint256 payoutVND = _tokenBalance * lastDistribution.dividendPerTokenVND;
        claimedDividends[msg.sender] = payoutVND;

        emit DividendClaimed(msg.sender, payoutVND);
        return payoutVND;
    }
}`,
      comparison: {
        memorySafety: 'Soroban Rust phân tách dữ liệu trả về kiểu Struct rõ ràng không có khả năng Memory Leak. Solidity lưu trữ WaterfallDistribution trên Storage công khai.',
        authorizationModel: 'Chỉ cán bộ thanh toán BIDV (Settlement Officer) tích hợp API BIDV Core Banking được kích hoạt luồng chi trả cổ tức.',
        storageCost: 'Tối ưu hóa ghi sổ cái trực tiếp trên Blockchain đảm bảo kiểm toán tính toán dòng tiền không thể bị sửa đổi retroactive.',
        standards: 'Phù hợp thông lệ Ngân hàng Đầu tư (Investment Banking) cho các cấu trúc Tài chính Dự án (Project Finance) & Tín dụng Xanh.'
      }
    }
  };

  // Smart Contract Architecture Modules Summary
  const smartContractModules = [
    {
      key: 'rwa_token' as const,
      name: 'ERC-3643 Security Token Contract',
      type: 'Core Asset Contract',
      languageRust: 'Rust / Soroban v21',
      languageSol: 'Solidity v0.8.20',
      description: 'Quản lý tổng cung token, hàm mint với 3/3 MPC, burn, transfer và phong tỏa tài sản khi xuất hiện sự kiện mặc định (Default Event).',
      automationRule: 'Tự động từ chối giao dịch nếu địa chỉ nhận chưa có ONCHAINID hợp lệ hoặc bị khóa bởi Compliance Rules.',
      status: 'ACTIVE & AUDITED BY PWC'
    },
    {
      key: 'identity_registry' as const,
      name: 'IdentityRegistry (ONCHAINID)',
      type: 'Compliance & eKYC Manager',
      languageRust: 'Rust / Soroban v21',
      languageSol: 'Solidity v0.8.20',
      description: 'Lưu trữ thông tin xác thực định danh (Claims) do BIDV/Tổ chức được ủy quyền phê duyệt.',
      automationRule: 'Xác minh realtime thuộc tính phân loại nhà đầu tư (Individual / Institutional / Foreign) trước mỗi lệnh mua bán.',
      status: 'SYNCED WITH BIDV CORE'
    },
    {
      key: 'compliance_rules' as const,
      name: 'Compliance Rules Engine',
      type: 'Regulatory Ruleset',
      languageRust: 'Rust / Soroban v21',
      languageSol: 'Solidity v0.8.20',
      description: 'Thực thi các hạn mức pháp lý: giới hạn số lượng nhà đầu tư cá nhân (<100 người), thời gian đóng băng chuyển nhượng (Lockup).',
      automationRule: 'Tự động áp dụng chính sách kiểm soát chuyển nhượng thứ cấp tuân thủ quy định Ủy ban Chứng khoán.',
      status: 'ENFORCED 24/7'
    },
    {
      key: 'escrow_waterfall' as const,
      name: 'BIDV Escrow & Waterfall Bridge',
      type: 'Banking Settlement Hook',
      languageRust: 'Rust / Soroban v21',
      languageSol: 'Solidity v0.8.20',
      description: 'Kết nối trực tiếp Smart Contract với Tài khoản Escrow phong tỏa tại Ngân hàng BIDV.',
      automationRule: 'Khi EVN chuyển tiền thanh toán điện, hợp đồng tự động phân bổ lợi tức trực tiếp về ví Fiat VND của nhà đầu tư.',
      status: 'CONNECTED TO BIDV CORE'
    }
  ];

  // Copy Code Handler
  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Interactive Simulation Handler
  const handleRunIssuanceSimulation = () => {
    setIsSimulating(true);
    setCurrentSimStep(1);
    setMpcSignaturesCount(0);
    setSimLogs(['[00:00:01] Khởi tạo đợt phát hành mới: 500.000 WIND Token (Giai đoạn 2)...']);

    setTimeout(() => {
      setCurrentSimStep(2);
      setSimLogs(prev => [...prev, '[00:00:02] ONCHAINID Verification: 100% Nhà đầu tư đã duyệt eKYC & bổ sung thông tin thuế.']);
    }, 1200);

    setTimeout(() => {
      setCurrentSimStep(3);
      setMpcSignaturesCount(1);
      setSimLogs(prev => [...prev, '[00:00:03] MPC Signature 1/3: SPV Năng Lượng Xanh đã duyệt mảnh khóa Key Share 1.']);
    }, 2400);

    setTimeout(() => {
      setMpcSignaturesCount(2);
      setSimLogs(prev => [...prev, '[00:00:04] MPC Signature 2/3: Ngân hàng Lưu ký BIDV đã duyệt mảnh khóa Key Share 2.']);
    }, 3600);

    setTimeout(() => {
      setMpcSignaturesCount(3);
      setSimLogs(prev => [...prev, '[00:00:05] MPC Signature 3/3: PwC Audit Node đã duyệt mảnh khóa Key Share 3. Đã đạt ngưỡng 3/3!']);
    }, 4800);

    setTimeout(() => {
      setCurrentSimStep(4);
      setSimLogs(prev => [...prev, '[00:00:06] Soroban/EVM Smart Contract mint(): Thực thi mã lệnh Mint 500.000 WIND. Tx Hash: 0xf92a...8831']);
    }, 6000);

    setTimeout(() => {
      setCurrentSimStep(5);
      setSimLogs(prev => [...prev, '[00:00:07] Hoàn tất! Token đã được lưu ký an toàn tại Fireblocks Enterprise Vault & Escrow Sync thành công.']);
      setIsSimulating(false);
    }, 7200);
  };

  const activeContractData = smartContractsSource[selectedContractKey];

  return (
    <div className="space-y-6">
      {/* Top Banner Architecture & Overview */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  Quy Trình Phát Hành, Lưu Ký & Rà Soát Mã Nguồn Smart Contract
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Đối chiếu chi tiết tiêu chuẩn Quốc tế ERC-3643 qua 2 ngôn ngữ lập trình <strong>Rust (Stellar Soroban)</strong> và <strong>Solidity (EVM Standard)</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunIssuanceSimulation}
              disabled={isSimulating}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs px-4 py-3 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : 'fill-slate-950'}`} />
              <span>{isSimulating ? 'Đang Thực Thi Quy Trình Phê Duyệt...' : 'Giả Lập Quy Trình Phát Hành Tranche Mới'}</span>
            </button>

            <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center space-x-3 text-xs">
              <div>
                <p className="text-slate-400">Chuẩn Token RWA</p>
                <p className="font-bold text-emerald-400 font-mono mt-0.5">ERC-3643 (Rust & Sol)</p>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <p className="text-slate-400">Ngưỡng Chữ Ký</p>
                <p className="font-bold text-cyan-400 font-mono mt-0.5">{mpcSignaturesCount} / 3 MPC Signed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation Terminal Log Banner */}
        {simLogs.length > 0 && (
          <div className="mt-5 p-4 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl font-mono text-xs space-y-1.5 text-cyan-300">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-2 mb-2 font-sans">
              <span className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <strong className="text-slate-200">Nhật Ký Thực Thi Smart Contract Real-Time (Live Trace)</strong>
              </span>
              <span className="text-emerald-400 font-bold">STATUS: RUNNING</span>
            </div>
            {simLogs.map((log, idx) => (
              <p key={idx} className="leading-relaxed">{log}</p>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs for Section Selection */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'workflow'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Quy Trình Phê Duyệt 5 Bước</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'contracts'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>2. Sơ Đồ Bộ Hợp Đồng Thông Minh</span>
        </button>

        <button
          onClick={() => setActiveTab('code_inspector')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'code_inspector'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>3. Mã Nguồn Smart Contract (Rust vs Solidity Inspector)</span>
          <span className="bg-black/30 text-slate-950 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
            Dual Engine
          </span>
        </button>

        <button
          onClick={() => setActiveTab('vaults')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'vaults'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>4. Hạ Tầng Lưu Ký Fireblocks & Sổ Cái Stellar</span>
        </button>
      </div>

      {/* TAB 1: 5-Step Visual Workflow Diagram */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Sơ Đồ Chi Tiết Quy Trình Phê Duyệt & Phát Hành Token
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mô hình liên kết giữa Thẩm định tài chính, Phê duyệt pháp lý, Chữ ký MPC và Tự động hóa Smart Contract
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                Chuẩn Hóa Theo Tiêu Chuẩn BIDV RWA
              </span>
            </div>

            {/* Step Cards Flow */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {workflowSteps.map((s, idx) => {
                const IconComponent = s.icon;
                const isStepActive = isSimulating && currentSimStep === s.step;
                const isStepDone = currentSimStep > s.step || (!isSimulating && currentSimStep === 0);

                return (
                  <div
                    key={s.step}
                    className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      isStepActive
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/50 scale-105 z-10'
                        : isStepDone
                        ? 'bg-black/30 backdrop-blur-md border-white/10'
                        : 'bg-black/20 border-white/5 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl border ${s.badgeColor}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                          Bước {s.step}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 mb-1">{s.title}</h4>
                      <p className="text-[10px] font-bold text-cyan-400 mb-2">{s.role}</p>
                      <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{s.description}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 bg-white/5 -mx-4 -mb-4 p-3 rounded-b-2xl">
                      <p className="text-[10px] font-semibold text-amber-300 flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Smart Contract Hành Động:
                      </p>
                      <p className="text-[10px] text-slate-400 leading-normal">{s.smartContractRole}</p>
                    </div>

                    {idx < 4 && (
                      <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                        <div className="w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-slate-400">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive MPC Multi-Party Approval Council Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Key className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Cơ Chế Phê Duyệt MPC 3/3 (Multi-Party Computation)</h3>
              </div>

              <p className="text-xs text-slate-400 mb-6">
                Mỗi giao dịch phát hành hoặc điều chỉnh Smart Contract bắt buộc thu thập đủ 3 Chữ ký mật mã độc lập từ 3 tổ chức khác nhau để loại bỏ điểm thất bại đơn lẻ (Single Point of Failure):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Key Share Node 1 */}
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
                  mpcSignaturesCount >= 1 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/20 border-white/10'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">Nút Chữ Ký 1</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      mpcSignaturesCount >= 1 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {mpcSignaturesCount >= 1 ? 'SIGNED' : 'WAITING'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-400">Chủ Dự Án (SPV Năng Lượng)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Xác nhận tình trạng pháp lý và sản lượng turbine thực tế.</p>
                </div>

                {/* Key Share Node 2 */}
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
                  mpcSignaturesCount >= 2 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/20 border-white/10'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">Nút Chữ Ký 2</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      mpcSignaturesCount >= 2 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {mpcSignaturesCount >= 2 ? 'SIGNED' : 'WAITING'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-cyan-400">Ngân Hàng Lưu Ký (BIDV)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Khóa tài khoản Escrow phong tỏa và đối soát dòng tiền Fiat.</p>
                </div>

                {/* Key Share Node 3 */}
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
                  mpcSignaturesCount >= 3 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/20 border-white/10'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">Nút Chữ Ký 3</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      mpcSignaturesCount >= 3 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {mpcSignaturesCount >= 3 ? 'SIGNED' : 'WAITING'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-indigo-400">Đơn Vị Kiểm Toán (PwC)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Thẩm định báo cáo kiểm toán độc toán & tuân thủ định giá.</p>
                </div>
              </div>
            </div>

            {/* Governance Summary */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-3">Tóm Tắt An Toàn Lưu Ký</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-200">Bảo Hiểm Lưu Ký Enterprise</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Fireblocks cam kết gói bảo hiểm rủi ro lưu ký lên đến 300 triệu USD.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-200">Không Lưu Trữ Private Key</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Khóa bí mật được phân mảnh ngẫu nhiên (Zero-Knowledge MPC Key Shares).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-400 font-medium text-center">
                ● 100% Giao dịch tuân thủ Thông tư Ngân hàng Nhà nước
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Smart Contract Architecture Modules Overview */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Kiến Trúc Bộ Smart Contract ERC-3643 (Hỗ Trợ Cả Rust & Solidity)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bộ hợp đồng thông minh lập trình các quy định pháp lý, tự động hóa quản trị và kiểm soát giao dịch an toàn
                </p>
              </div>

              <button
                onClick={() => setActiveTab('code_inspector')}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>Trình Trích Xuất Mã Nguồn Dual Engine</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {smartContractModules.map((sc) => (
                <div key={sc.key} className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-slate-100">{sc.name}</h4>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                        {sc.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-mono mb-3">
                      {sc.type} • <span className="text-amber-400">{sc.languageRust}</span> / <span className="text-cyan-400">{sc.languageSol}</span>
                    </p>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">{sc.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                      <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">Cơ Chế Tự Động Hóa (Automation Rule):</p>
                      <p className="text-slate-300 leading-relaxed">{sc.automationRule}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedContractKey(sc.key);
                          setCodeLanguage('rust');
                          setActiveTab('code_inspector');
                        }}
                        className="flex items-center justify-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Code Rust</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedContractKey(sc.key);
                          setCodeLanguage('solidity');
                          setActiveTab('code_inspector');
                        }}
                        className="flex items-center justify-center space-x-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Code Solidity</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Full Smart Contract Source Code Inspector with Dual Language Toggles (Rust vs Solidity) & Audit Matrix */}
      {activeTab === 'code_inspector' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            {/* Header & Contract Tabs Selector */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center space-x-2">
                  <Code2 className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-bold text-slate-100">
                    Trình Rà Soát & Kiểm Tra Mã Nguồn Smart Contract
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Được thiết kế theo tiêu chuẩn Ngân hàng & Thông lệ Quốc tế (ERC-3643 / TREX Standard). Hỗ trợ cả 2 môi trường thực thi <strong>Rust (Soroban WASM)</strong> và <strong>Solidity (EVM)</strong>.
                </p>
              </div>

              {/* Language Switcher Buttons */}
              <div className="flex items-center space-x-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setCodeLanguage('rust')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    codeLanguage === 'rust'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>🦀 Rust (Soroban SDK)</span>
                </button>

                <button
                  onClick={() => setCodeLanguage('solidity')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    codeLanguage === 'solidity'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>🔷 Solidity (EVM ERC-3643)</span>
                </button>

                <button
                  onClick={() => setCodeLanguage('comparison')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    codeLanguage === 'comparison'
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>📊 So Sánh Architecture</span>
                </button>
              </div>
            </div>

            {/* Contract File Selection Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {smartContractModules.map((mod) => (
                  <button
                    key={mod.key}
                    onClick={() => setSelectedContractKey(mod.key)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedContractKey === mod.key
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-black/30 text-slate-400 hover:text-slate-200 border border-white/10'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>
                      {codeLanguage === 'solidity' ? smartContractsSource[mod.key].filenameSol : smartContractsSource[mod.key].filenameRust}
                    </span>
                  </button>
                ))}
              </div>

              {codeLanguage !== 'comparison' && (
                <button
                  onClick={() => handleCopyCode(
                    selectedContractKey, 
                    codeLanguage === 'solidity' ? activeContractData.solidityCode : activeContractData.rustCode
                  )}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-slate-100 font-bold text-xs px-3.5 py-2 rounded-xl border border-white/10 transition-all cursor-pointer"
                >
                  {copiedKey === selectedContractKey ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Đã Sao Chép Code!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-300" />
                      <span>Sao Chép {codeLanguage === 'solidity' ? activeContractData.filenameSol : activeContractData.filenameRust}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Contract Overview Meta Banner */}
            <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-slate-100 text-sm">{activeContractData.title}</p>
                <p className="text-slate-300 mt-1">{activeContractData.purpose}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full whitespace-nowrap font-bold">
                  {codeLanguage === 'solidity' ? 'Solidity v0.8.20 (EVM)' : codeLanguage === 'rust' ? 'Rust / Soroban v21.0 (WASM)' : 'Security Audit Matrix'}
                </span>
              </div>
            </div>

            {/* CODE DISPLAY MODE: RUST OR SOLIDITY */}
            {codeLanguage !== 'comparison' ? (
              <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Terminal Header Bar */}
                <div className="bg-black/60 px-4 py-3 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-slate-300 font-bold">
                      {codeLanguage === 'solidity' ? activeContractData.filenameSol : activeContractData.filenameRust}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    UTF-8 • {codeLanguage === 'solidity' ? 'Solidity EVM ERC-3643 Standard' : 'Rust Soroban Native WASM'}
                  </span>
                </div>

                {/* Code Scroll Box */}
                <div className="p-4 font-mono text-xs overflow-x-auto max-h-[550px] scrollbar-thin text-slate-200 leading-relaxed bg-black/50">
                  {(codeLanguage === 'solidity' ? activeContractData.solidityCode : activeContractData.rustCode)
                    .split('\n')
                    .map((line, idx) => {
                      const lineNum = idx + 1;
                      const isComment = line.trim().startsWith('//') || line.trim().startsWith('///') || line.trim().startsWith('*');
                      const isAttribute = line.trim().startsWith('#[') || line.trim().startsWith('pragma') || line.trim().startsWith('// SPDX');
                      const isFn = line.trim().startsWith('pub fn') || line.trim().startsWith('function ') || line.trim().startsWith('fn ');
                      const isStructEnum = line.trim().startsWith('pub struct') || line.trim().startsWith('contract ') || line.trim().startsWith('interface ') || line.trim().startsWith('struct ');

                      return (
                        <div key={idx} className="flex hover:bg-white/5 px-2 py-0.5 rounded transition-colors group">
                          <span className="w-10 text-right pr-4 text-slate-600 select-none flex-shrink-0 group-hover:text-slate-400">
                            {lineNum}
                          </span>
                          <span className={`whitespace-pre ${
                            isComment 
                              ? 'text-emerald-400 font-semibold' 
                              : isAttribute 
                              ? 'text-purple-400 font-medium' 
                              : isFn 
                              ? 'text-amber-300 font-bold' 
                              : isStructEnum 
                              ? 'text-cyan-300 font-bold' 
                              : 'text-slate-200'
                          }`}>
                            {line}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              /* COMPARISON & AUDIT MATRIX MODE */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rust / Soroban Characteristics */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <FileCode className="w-5 h-5 text-amber-400" />
                      <h4 className="font-bold text-slate-100 text-sm">🦀 Đặc Tính Mạng Stellar Soroban (Rust)</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Memory Safety:</strong> Trình biên dịch Rust loại bỏ 100% rủi ro Buffer Overflow & Reentrancy attacks ngay từ thời điểm Compile.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Native Multi-sig & Auth:</strong> Tích hợp sẵn cơ chế <code className="text-amber-300 bg-black/40 px-1 rounded">require_auth()</code> phân mảnh khóa cryptographic ed25519 trực tiếp.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Tốc độ & Phí cố định:</strong> Thời gian tạo block 3-5 giây, phí transaction gần như bằng 0 (0.00001 XLM/tx), phù hợp với việc phân bổ cổ tức hàng ngày.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Solidity / EVM Characteristics */}
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <Code2 className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-bold text-slate-100 text-sm">🔷 Đặc Tính Mạng EVM (Solidity ERC-3643)</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Chuẩn Hóa Quốc Tế:</strong> T-REX Framework (ERC-3643) là chuẩn chung của hơn 30 định chế tài chính toàn cầu (Tokeny, Polygon, Avalanche Subnets).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Hệ Sinh Thái DeFi Rộng:</strong> Dễ dàng kết nối với các sàn giao dịch tài sản mã hóa tập trung (CEX) và định chế tài chính quốc tế sử dụng EVM.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Cơ chế Phân Quyền:</strong> Yêu cầu sử dụng các bộ thư viện bảo mật như OpenZeppelin, Gnosis Safe và ReentrancyGuard để chống tấn công reentrancy.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Comparative Breakdown Table */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5">
                  <h4 className="font-bold text-slate-100 text-sm mb-3 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Bảng So Sánh Chi Tiết Kiến Trúc An Ninh Smart Contract ({activeContractData.filenameRust} vs {activeContractData.filenameSol})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="font-bold text-amber-300 mb-1">Mô Hình An Toàn Bộ Nhớ (Memory Safety):</p>
                      <p className="text-slate-300 leading-relaxed">{activeContractData.comparison.memorySafety}</p>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="font-bold text-cyan-300 mb-1">Cơ Chế Xác Thực & Phê Duyệt Quyền (Auth Model):</p>
                      <p className="text-slate-300 leading-relaxed">{activeContractData.comparison.authorizationModel}</p>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="font-bold text-emerald-300 mb-1">Quản Lý Bộ Nhớ Lưu Trữ & Chi Phí State (Storage & Gas):</p>
                      <p className="text-slate-300 leading-relaxed">{activeContractData.comparison.storageCost}</p>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="font-bold text-indigo-300 mb-1">Độ Tương Thích Chuẩn Pháp Lý Quốc Tế (Standards & Regulations):</p>
                      <p className="text-slate-300 leading-relaxed">{activeContractData.comparison.standards}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Fireblocks Vaults & Stellar Ledger Live Table */}
      {activeTab === 'vaults' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fireblocks Custody Vaults */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-slate-100">Danh Sách Ví Lưu Ký Fireblocks Enterprise</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-300 bg-black/30 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
                  {custodyProvider}
                </span>
              </div>

              <div className="space-y-4">
                {vaults.map((vault) => (
                  <div key={vault.id} className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="font-bold text-sm text-slate-100">{vault.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                        {vault.vaultType}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/5">
                      <div>
                        <p className="text-slate-400">Số dư Token Tokenized:</p>
                        <p className="font-bold text-emerald-400 text-sm mt-0.5">
                          {vault.balanceTokens.toLocaleString('vi-VN')} {vault.assetCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Số dư Tài khoản Escrow Fiat:</p>
                        <p className="font-bold text-slate-100 text-sm mt-0.5">
                          {vault.fiatEscrowVND.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Chữ ký bảo vệ MPC: <strong className="text-slate-200">{vault.mpcKeyShares}/3 Nút mạng</strong></span>
                      <span className="text-emerald-400 font-medium">Bảo hiểm lưu ký 100%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custody Governance Roles */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-4">Phân Định Trách Nhiệm Lưu Ký Các Bên</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                    <p className="font-bold text-cyan-400">Ngân hàng Lưu ký BIDV</p>
                    <p className="text-slate-300 mt-1">Đứng tên chủ tài khoản Escrow phong tỏa, giám sát dòng tiền chi trả cổ tức và quản lý 1 mảnh khóa MPC Key Share 2.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                    <p className="font-bold text-emerald-400">Chủ Đầu Tư SPV Năng Lượng</p>
                    <p className="text-slate-300 mt-1">Gợi ý lệnh phát hành mới, cung cấp hồ sơ pháp lý tài sản turbine và giữ 1 mảnh khóa MPC Key Share 1.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                    <p className="font-bold text-indigo-400">Đơn Vị Kiểm Toán PwC</p>
                    <p className="text-slate-300 mt-1">Đánh giá độc lập giá trị tài sản rò rỉ, xác nhận tính tuân thủ pháp lý và giữ 1 mảnh khóa MPC Key Share 3.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Trạng thái Mạng lưới: <strong className="text-emerald-400">Connected</strong></span>
                <span className="text-slate-200 font-mono">MPC Latency: 12ms</span>
              </div>
            </div>
          </div>

          {/* Stellar Public Blockchain Live Ledger */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">Sổ Cái Minh Bạch Trên Blockchain (Soroban / EVM Ledger)</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Mạng lưới:</span>
                <span className="font-mono text-emerald-400 bg-black/30 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 font-bold">
                  {blockchainNetwork}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-200 border-b border-white/10 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Loại Giao Dịch</th>
                    <th className="py-3.5 px-4">Transaction Hash</th>
                    <th className="py-3.5 px-4">Ledger Block</th>
                    <th className="py-3.5 px-4">Từ Ví (From)</th>
                    <th className="py-3.5 px-4">Đến Ví (To)</th>
                    <th className="py-3.5 px-4">Giá Trị / Số Lượng</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                  {stellarTxs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-emerald-400">{tx.type}</td>
                      <td className="py-3.5 px-4 text-slate-400">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</td>
                      <td className="py-3.5 px-4 text-slate-300">{tx.ledger}</td>
                      <td className="py-3.5 px-4 text-slate-400">{tx.from}</td>
                      <td className="py-3.5 px-4 text-slate-400">{tx.to}</td>
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-100">{tx.amount}</td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
