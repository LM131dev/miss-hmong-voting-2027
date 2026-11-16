const fs = require('fs');
const path = require('path');

console.log("Updating voting modal and admin backoffice...");

// 1. UPDATE src/app/page.jsx
const pagePath = path.join(process.cwd(), 'src', 'app', 'page.jsx');
let pageCode = fs.readFileSync(pagePath, 'utf8');

// Ensure imports in page.jsx
if (!pageCode.includes('Upload,') || !pageCode.includes('Image as ImageIcon,')) {
  pageCode = pageCode.replace(
    '  Building2,\n} from "lucide-react";',
    '  Building2,\n  Upload,\n  Copy,\n  Download,\n  Image as ImageIcon,\n  ArrowLeft,\n  AlertCircle,\n} from "lucide-react";'
  );
}

// Add state variables if not already added
if (!pageCode.includes('const [voteStep, setVoteStep] = useState(1);')) {
  pageCode = pageCode.replace(
    '  const [voteReceipt, setVoteReceipt] = useState(null);',
    '  const [voteReceipt, setVoteReceipt] = useState(null);\n  const [voteStep, setVoteStep] = useState(1);\n  const [slipPreview, setSlipPreview] = useState(null);\n  const [copiedBank, setCopiedBank] = useState(false);'
  );
}

// Update openVoteModal
const oldOpenVoteModal = `  const openVoteModal = (c, presetPkg = null) => {
    setVotingContestant(c);
    setVoteReceipt(null);
    setPaymentRef(
      \`\${paymentMethod}-\${Math.floor(100000 + Math.random() * 900000)}\`
    );
    if (presetPkg) {
      setSelectedPkg(presetPkg);
    } else if (packages.length > 0 && !selectedPkg) {
      setSelectedPkg(packages[2] || packages[1] || packages[0]);
    }
  };`;

const newOpenVoteModal = `  const openVoteModal = (c, presetPkg = null) => {
    setVotingContestant(c);
    setVoteReceipt(null);
    setVoteStep(presetPkg ? 2 : 1);
    setSlipPreview(null);
    setCopiedBank(false);
    setPaymentRef(
      \`\${paymentMethod}-\${Math.floor(100000 + Math.random() * 900000)}\`
    );
    if (presetPkg) {
      setSelectedPkg(presetPkg);
    } else if (packages.length > 0 && !selectedPkg) {
      setSelectedPkg(packages[2] || packages[1] || packages[0]);
    }
  };

  const handleCopyBank = (accNum) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(accNum);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleSlipUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ (PNG, JPG, JPEG)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSlipPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };`;

if (pageCode.includes(oldOpenVoteModal)) {
  pageCode = pageCode.replace(oldOpenVoteModal, newOpenVoteModal);
}

// Update handleVoteSubmit to include slip_image_url
const oldHandleVoteSubmit = `          cheer_message: cheerMessage,
          payment_ref: paymentRef,
          instant_demo: instantDemo,`;

const newHandleVoteSubmit = `          cheer_message: cheerMessage,
          payment_ref: paymentRef,
          slip_image_url: slipPreview,
          instant_demo: instantDemo,`;

if (pageCode.includes(oldHandleVoteSubmit)) {
  pageCode = pageCode.replace(oldHandleVoteSubmit, newHandleVoteSubmit);
}

fs.writeFileSync(pagePath, pageCode, 'utf8');
console.log("Updated page.jsx state and handlers successfully!");
