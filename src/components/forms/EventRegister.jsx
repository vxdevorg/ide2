/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import emailjs from '@emailjs/browser';

export default function EventRegister({ language, themeColor }) {

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    wmobile: "",
    gender: "",
    age: "",
    email: "",
    district: "",
    udid: "",
    disability: "",
    address: "",
    file: null,
    agree: false,
  });

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = "service_r9n30i6";
  const EMAILJS_TEMPLATE_ID = "template_auty7l8";
  const EMAILJS_PUBLIC_KEY = "ghyez6ld3s9yGUx0l";

  const isFormInvalid = () => {
    if (Object.keys(errors).length > 0) return true;
    const requiredFields = [
      "firstName",
      "mobile",
      "wmobile",
      "gender",
      "age",
      "district",
      "udid",
      "disability",
      "address",
      "Description"
    ];

    for (let field of requiredFields) {
      if (!formData[field] || String(formData[field]).trim() === "") {
        return true;
      }
    }

    // File must be uploaded
    if (!formData.file) return true;

    // User must agree
    if (!formData.agree) return true;

    return false;
  };


  const handleReset = () => {
    // 🔓 Free the blob URL from memory before clearing
    if (filePreview && filePreview.url) {
      URL.revokeObjectURL(filePreview.url);
    }

    setFormData({
      fullName: "",
      firstName: "",
      lastName: "",
      mobile: "",
      wmobile: "",
      gender: "",
      age: "",
      email: "",
      Mailid: "",
      district: "",
      udid: "",
      disability: "",
      address: "",
      Description: "",
      file: null,
      agree: false,
    });
    setFilePreview(null);
    setErrors({});
  };


  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100%
  const [uploadSpeed, setUploadSpeed] = useState(0); // bytes per second
  const [uploadTimeRemaining, setUploadTimeRemaining] = useState(0); // seconds
  const [responseMsg, setResponseMsg] = useState("")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const setFieldError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearFieldError = (field) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const sendConfirmationEmail = async (formData) => {
    if (!formData.Mailid || formData.Mailid.trim() === '') {
      console.log("No email provided, skipping email confirmation");
      return false;
    }

    try {
      console.log("Attempting to send email to:", formData.Mailid);

      const templateParams = {
        to_email: formData.Mailid,
        to_name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        full_name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        mobile_number: formData.mobile || 'Not provided',
        whatsapp_number: formData.wmobile || 'Not provided',
        email: formData.Mailid,
        gender: formData.gender || 'Not provided',
        age: formData.age || 'Not provided',
        district: formData.district || 'Not provided',
        udid_number: formData.udid || 'Not provided',
        disability_type: formData.disability || 'Not provided',
        address: formData.address || 'Not provided',
        video_description: formData.Description || 'Not provided',
        event_name: language === "Tamil"
          ? "மாற்றுத் திறனாளிகளுக்கான தனித் திறமையாளர் போட்டி"
          : "Talent Competition for Differently Abled Persons",
        submission_date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      };

      console.log("📧 Email template params:", templateParams);

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("✅ Confirmation email sent successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Failed to send confirmation email:", error);
      console.error("Error details:", {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY ? "Present" : "Missing"
      });
      return false;
    }
  };
  const validateAndPreviewFile = (file) => {
    if (!file) return;

    const allowedExtensions = ["mp4", "mov", "avi"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const maxSize = 250 * 1024 * 1024; // 250MB

    // ❌ Invalid file type
    if (!allowedExtensions.includes(fileExtension)) {
      setFieldError(
        "file",
        language === "English"
          ? "Invalid file type. Only  MP4, MOV, AVI allowed."
          : "தவறான கோப்பு வகை.  MP4, MOV, AVI மட்டுமே அனுமதிக்கப்படுகின்றன."
      );
      setFilePreview(null);
      return;
    }

    // ❌ Invalid file size
    if (file.size > maxSize) {
      setFieldError(
        "file",
        language === "English"
          ? "File size exceeds 250MB limit."
          : "கோப்பின் அளவு 250MB-ஐக் கடந்துவிடக்கூடாது."
      );
      setFilePreview(null);
      return;
    }

    // ✅ Valid file — preview setup
    // 🔓 If there's an old preview, revoke its URL first to free memory
    if (filePreview && filePreview.url) {
      URL.revokeObjectURL(filePreview.url);
    }

    setFormData({ ...formData, file });
    clearFieldError("file");

    const fileURL = URL.createObjectURL(file);
    setFilePreview({
      type: fileExtension,
      url: fileURL,
      name: file.name,
    });
  };

  // === TRANSLATION OBJECT ===
  const t = {
    en: {
      maintitle: "Talent Competition for Differently Abled Persons",
      title: "Registration for the Online Talent Competition",
      subtitle: "Registration / Participation Details",
      firstName: "First Name *",
      LastName: "Last Name ",
      mobile: "Mobile Number *",
      wmobile: "Whatsapp Mobile No *",
      Mailid: "Email ID ",
      gender: "Gender *",
      genders: ["Male", "Female", "Other"],
      age: "Age *",
      district: "District *",
      districts: [
        "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tirunelveli",
        "Thoothukudi", "Vellore", "Kanchipuram", "Cuddalore", "Namakkal", "Dharmapuri", "Krishnagiri",
        "Dindigul", "Theni", "Virudhunagar", "Sivagangai", "Pudukkottai", "Karur", "Tiruppur", "Nilgiris",
        "Nagapattinam", "Thanjavur", "Ariyalur", "Perambalur", "Villupuram", "Kallakurichi",
        "Ramanathapuram", "Tenkasi", "Chengalpattu", "Tiruvannamalai", "Tiruvarur", "Mayiladuthurai",
        "Kanniyakumari", "South Chennai", "Ranipet", "North Chennai", "tiruvallur", "Tirupathur"        
      ],
      udid: "UDID Card Number *",
      disability: "Type of Disability *",
      disabilities: [
        "Locomotor Disability",
        "Acid Attack Victims",
        "Cerebral Palsy",
        "Leprosy Cured Persons",
        "Muscular Dystrophy",
        "Dwarfism",
        "Blindness",
        "Low Vision",
        "Hearing Impairment",
        "Speech and Language Disability",
        "Intellectual Disability",
        "Autism Spectrum Disorder",
        "Specific Learning Disabilities",
        "Mental Illness",
        "Chronic Neurological Conditions",
        "Multiple Sclerosis",
        "Parkinson's Disease",
        "Thalassemia",
        "Hemophilia",
        "Sickle Cell Disease",
        "Multiple Disabilities", "Other"
      ],
      address: "Address *",
      Description: "Description",
      uploadLabel: "Talent Video (Max 250MB)*",
      uploadText: "Click to Upload",
      fileType: "File Type: .mp4, .mov, .avi, .mkv, .webm",
      uploadingOverlay: "Uploading video, please wait...",
      uploadingButton: "Uploading...",
      speedLabel: "Speed: ",
      timeRemainingLabel: "Time remaining: ",
      uploadFailed: "Video upload failed. Please try again.",
      uploadConnectionError: "Upload error. Please check your connection.",
      submitError: "Something went wrong while submitting the form.",
      declaration:
        "I hereby declare that all the information provided is true and accurate to the best of my knowledge. I understand that any false information may lead to disqualification from the event.",
      reset: "Reset",
      submit: "Submit Registration",
      success: "Form submitted successfully!",
      select: "Select",
      uploaded: "Uploaded:",
      errors: {
        name: "Full name should contain only letters.",
        mobile: "Mobile number must be exactly 10 digits.",
        age: "Age must be a positive number.",
        udid: "UDID number must start with TN- followed by at least 16 digits.",
        district: "Please select a district.",
        disability: "Please select a type of disability.",
        fileSize: "File size exceeds 250MB limit.",
        fileRequired: "Please upload a talent video.",
      },
    },
    ta: {
      maintitle: "மாற்றுத் திறனாளிகளுக்கான - தனித் திறமையாளர் போட்டி",
      title: "இணையத்தின் மூலம் நடைபெறும் தனித் திறமை போட்டிக்கான பதிவு",
      subtitle: "பதிவு / பங்கேற்பு விவரங்கள்",
      firstName: "முதல் பெயர் *",
      LastName: "கடைசி பெயர் ",
      mobile: "கைபேசி எண் *",
      wmobile: "வாட்ஸ்அப் மொபைல் எண் *",
      Mailid: "மின்னஞ்சல் ",
      gender: "பாலினம் *",
      genders: ["ஆண்", "பெண்", "பிற"],
      age: "வயது *",
      district: "மாவட்டம் *",
      districts: [
        "கோயம்புத்தூர்", "மதுரை", "திருச்சி", "சேலம்", "ஈரோடு", "திருநெல்வேலி",
        "தூத்துக்குடி", "வேலூர்", "காஞ்சிபுரம்", "கடலூர்", "நாமக்கல்", "தர்மபுரி", "கிருஷ்ணகிரி",
        "திண்டுக்கல்", "தேனி", "விருதுநகர்", "சிவகங்கை", "புதுக்கோட்டை", "கரூர்", "திருப்பூர்",
        "நீலகிரி", "நாகப்பட்டினம்", "தஞ்சாவூர்", "அரியலூர்", "பெரம்பலூர்", "விழுப்புரம்", "கள்ளக்குறிச்சி",
        "ராமநாதபுரம்", "தென்காசி", "செங்கல்பட்டு", "திருவண்ணாமலை", "திருவாரூர்", "மயிலாடுதுறை",
        "கன்னியாகுமரி", "வட சென்னை", "ராணிப்பேட்டை", "தென் சென்னை", "திருவள்ளுர்", "திருப்பத்தூர்"
      ],
      udid: "UDID எண்*",
      disability: "மாற்றுத் திறனின் வகை *",
      disabilities: [
        "கை கால் இயக்கக் குறைபாடு",
        "அமில வீச்சினால் பாதிக்கப்பட்டோர்",
        "மூளை முடக்குவாதத்தால் பாதிக்கப்பட்டோர்",
        "தொழுநோயிலிருந்து குணமடைந்தோர்",
        "தசைச்சிதைவு நோய்",
        "குள்ளத்தன்மை",
        "கண் பார்வையின்மை",
        "குறை பார்வை",
        "காது கேளாமை / செவித்திறன் குறைபாடு",
        "பேச்சு மற்றும் மொழித்திறன் குறைபாடு",
        "அறிவுசார் குறைபாடு (மன வளர்ச்சிக் குன்றியோர்)",
        "புறவுலக சிந்தனையற்றோர்",
        "குறிப்பிட்ட கற்றலில் குறைபாடு",
        "மன நோய்",
        "நாள்பட்ட நரம்பியல் பாதிப்பு",
        "திசு பன்முகக் கடினமாதல்",
        "நடுக்கு வாதம்",
        "இரத்த அழிவுச்சோகை",
        "இரத்த உறையாமை அல்லது இரத்த ஒழுகு குறைபாடு",
        "அரிவாளணு இரத்தச் சோகை",
        "பல்வகை குறைபாடு", "மற்றவை"
      ],
      address: "முகவரி *",
      Description: "விவரம்",
      uploadLabel: "திறமைக்கான காணொளி (அதிகபட்சம் 250MB)*",
      uploadText: "பதிவேற்ற கிளிக் செய்யவும்",
      fileType: "கோப்பு வகை: .mp4, .mov, .avi, .mkv, .webm",
      uploadingOverlay: "வீடியோ மேலேற்றப்படுகிறது, தயவுசெய்து காத்திருக்கவும்...",
      uploadingButton: "மேலேற்றுகிறது...",
      speedLabel: "வேகம்: ",
      timeRemainingLabel: "மீதமுள்ள நேரம்: ",
      uploadFailed: "வீடியோ பதிவேற்றம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
      uploadConnectionError: "பதிவேற்றத் தவறு. உங்கள் இணைப்பை சரிபார்க்கவும்.",
      submitError: "படிவத்தை சமர்ப்பிப்பதில் பிழை ஏற்பட்டது.",
      declaration:
        "நான் வழங்கியுள்ள அனைத்து தகவல்கள் உண்மையானவை என்று அறிவிக்கிறேன். தவறான தகவல் வழங்கப்பட்டால், போட்டியிலிருந்து தகுதி நீக்கம் செய்யப்படலாம் என்பதை ஏற்கிறேன்.",
      reset: "ரீசெட்",
      submit: "சமர்ப்பிக்கவும்",
      success: "படிவம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
      select: "தேர்வு செய்யவும்",
      uploaded: "பதிவேற்றப்பட்டது:",
      errors: {
        name: "பெயர் எழுத்துக்களால் மட்டுமே இருக்க வேண்டும்.",
        mobile: "மொபைல் எண் 10 இலக்கங்கள் கொண்டதாக இருக்க வேண்டும்.",
        age: "வயது 0-க்கும் மேல் இருக்க வேண்டும்.",
        udid: "UDID எண் TN- எனத் தொடங்கி குறைந்தது 6 இலக்கங்கள் கொண்டிருக்க வேண்டும்.",
        district: "ஒரு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.",
        disability: "உங்கள் குறைபாடு வகையைத் தேர்ந்தெடுக்கவும்.",
        fileSize: "கோப்பின் அளவு 250MB-ஐக் கடந்துவிடக்கூடாது.",
        fileRequired: "தயவுசெய்து ஒரு வீடியோ பதிவேற்றவும்.",
      },
    },
  };

  const lang = language === "Tamil" ? "ta" : "en";
  const text = t[lang];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let updatedValue = value;

    // ✅ Allow ONLY alphabets & spaces for name fields
    if (name === "firstName" || name === "lastName") {
      updatedValue = updatedValue.replace(/[^A-Za-z ]/g, "");
    }

    // ✅ Allow only numbers (max 10) for mobile
    if (name === "mobile") {
      updatedValue = updatedValue.replace(/[^0-9]/g, "");
      if (updatedValue.length > 10) updatedValue = updatedValue.slice(0, 10);

      if (updatedValue.length === 1 && !/[6-9]/.test(updatedValue[0])) {
        updatedValue = ""; // clear invalid starting digit
      }
    }

    if (name === "wmobile") {
      updatedValue = updatedValue.replace(/[^0-9]/g, "");
      if (updatedValue.length > 10) updatedValue = updatedValue.slice(0, 10);

      if (updatedValue.length === 1 && !/[6-9]/.test(updatedValue[0])) {
        updatedValue = ""; // clear invalid starting digit
      }
    }

    // ✅ UDID — must start with TN- followed by up to 16 digits
    if (name === "udid") {
      // Convert to uppercase and strip invalid characters
      let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");

      // Block typing above 18 characters
      if (value.length > 18) {
        return; // stop typing beyond 18
      }

      // Update form data
      setFormData({ ...formData, [name]: value });

      // Validation
      const udidPattern = /^TN[A-Z0-9-]{16}$/; // TN + 16 valid chars = 18 total

      if (!value.startsWith("TN")) {
        setFieldError("udid", "UDID must start with 'TN'.");
      } else if (value.length < 18) {
        setFieldError("udid", "UDID must be exactly 18 characters long.");
      } else if (!udidPattern.test(value)) {
        setFieldError("udid", "Invalid UDID format.");
      } else {
        clearFieldError("udid");
      }
    }
    // ✅ Email validation (live)
    if (name === "Mailid") {
      updatedValue = updatedValue.toLowerCase().trim(); // lowercase + trim spaces

      // show live error but don't block typing
      if (
        updatedValue &&
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(updatedValue)
      ) {
        setFieldError(
          "Mailid",
          language === "English"
            ? "Please enter a valid email address (e.g., abc@gmail.com)."
            : "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும் (எ.கா., abc@gmail.com)."
        );
      } else {
        clearFieldError("Mailid"); // clear error when valid
      }
    }

    // ✅ Update state
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : updatedValue,
    });
  };

  const validateForm = () => {
    const e = text.errors;

    // Ensure a file is uploaded (mandatory)
    if (!formData.file) {
      setFieldError("file", e.fileRequired);
      return false;
    }

    // Ensure mobile number is exactly 10 digits
    if (!formData.mobile || String(formData.mobile).length !== 10) {
      setFieldError("mobile", e.mobile);
      return false;
    } else {
      clearFieldError("mobile");
    }

    if (!formData.wmobile || String(formData.wmobile).length !== 10) {
      setFieldError("wmobile", e.wmobile);
      return false;
    } else {
      clearFieldError("wmobile");
    }

    if (Number(formData.age) <= 0) {
      setFieldError("age", e.age);
      return false;
    }

    if (!formData.district) {
      setFieldError("district", e.district);
      return false;
    }

    if (!formData.disability) {
      setFieldError("disability", e.disability);
      return false;
    }

    // clear any form-level validation errors
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.age;
      delete copy.district;
      delete copy.disability;
      return copy;
    });
    return true;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 200 * 1024 * 1024) {
      setFormData({ ...formData, file });
      clearFieldError("file");
    } else {
      setFieldError("file", text.errors.fileSize);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1️⃣ FIRST CALL — get presigned URL
      const presignRes = await fetch(
        "https://8361zpzam9.execute-api.ap-south-1.amazonaws.com/default/createRegistration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getUploadUrl",
            fullName: ((formData.firstName || "") + " " + (formData.lastName || "")).trim(),
            mobileNumber: formData.mobile,
            uidCardNumber: formData.udid,
          }),
        }
      );

      const presignData = await presignRes.json();

      if (!presignRes.ok) {
        throw new Error(presignData.message || "Failed to get upload URL");
      }

      const { registrationId, key, upload } = presignData;

      // 2️⃣ S3 Upload
      const s3Form = new FormData();
      Object.entries(upload.fields).forEach(([k, v]) => s3Form.append(k, v));
      s3Form.append("file", formData.file);

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            const percent = Math.round((evt.loaded / evt.total) * 100);
            setUploadProgress(percent);
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("S3 upload failed"));
        };

        xhr.onerror = () => reject(new Error("S3 upload error"));
        xhr.open("POST", upload.url);
        xhr.send(s3Form);
      });

      // 3️⃣ SECOND CALL — finalSubmit (write to DB)
      const finalRes = await fetch(
        "https://8361zpzam9.execute-api.ap-south-1.amazonaws.com/default/createRegistration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "finalSubmit",
            registrationId,
            s3Key: key,
            fullName: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
            mobileNumber: formData.mobile,
            whatsappNumber: formData.wmobile,
            email: formData.Mailid,
            gender: formData.gender,
            age: formData.age,
            district: formData.district,
            uidCardNumber: formData.udid,
            typeOfDisability: formData.disability,
            address: formData.address,
            description: formData.Description,
            agree: formData.agree,
            eventId: "intl-disability-day-2025",
            assignedto: "Not Assigned",
            is_shortlisted: false,
            is_winner: false
          }),
        }
      );
      const finalData = await finalRes.json();

      if (!finalRes.ok) {
        throw new Error(finalData.message || "Final submit failed");
      }

      // 4️⃣ Success popup
      setShowSuccessPopup(true);
      handleReset();
      setIsUploading(false);
    } catch (err) {
      console.error("❌ Submit error:", err);
      setErrorPopupMessage(text.submitError);
      setShowErrorPopup(true);
      setIsUploading(false);
    }

    // In your handleSubmit function, after the first API call:
    const presignRes = await fetch(
      "https://8361zpzam9.execute-api.ap-south-1.amazonaws.com/default/createRegistration",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getUploadUrl",
          fullName: ((formData.firstName || "") + " " + (formData.lastName || "")).trim(),
          mobileNumber: formData.mobile,
          uidCardNumber: formData.udid,
        }),
      }
    );

    const presignData = await presignRes.json();

    if (!presignRes.ok) {
      if (presignRes.status === 409) {
        throw new Error("UDID_ALREADY_REGISTERED");
      }
      throw new Error(presignData.message || "Failed to get upload URL");
    }
  };
  // === RENDER ===
  return (
    <div id="event-register" className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1
        className="text-2xl md:text-3xl xl:text-[32px] font-bold mb-[50px] text-center"
        style={{ color: themeColor }}      >
        {text.maintitle}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg border border-gray-200 rounded-[10px] w-full max-w-[1046px] min-h-[1080px] mx-auto overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div
          className="px-6 py-5 md:px-8 md:py-6"
          style={{
            backgroundColor: themeColor + "80",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <h2 className="text-[28px] md:text-[32px] font-[500] text-black mb-2">
            {text.title}
          </h2>
          <p className="text-[14px] md:text-[16px] text-black opacity-80">
            {text.subtitle}
          </p>
        </div>
        {/* Fields */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* firstName*/}
          <div className="flex flex-col">
            <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">
              {text.firstName}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={
                language === "English"
                  ? "Enter your first name"
                  : "உங்கள் முதல் பெயரை உள்ளிடவும்"
              }
              className="border border-gray-300 bg-[rgba(236,234,234,1)] 
               text-gray-900 placeholder-gray-500
               p-2 rounded-lg w-full focus:outline-none focus:border-[#3355AE]"
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">
              {text.LastName}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={
                language === "English"
                  ? "Enter your last name"
                  : "உங்கள் கடைசி பெயரை உள்ளிடவும்"
              }
              className="border border-gray-300 bg-[rgba(236,234,234,1)] 
               text-gray-900 placeholder-gray-500
               p-2 rounded-lg w-full focus:outline-none focus:border-[#3355AE]"

            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Gender */}
          <SelectField label={text.gender} name="gender" options={text.genders} selectText={text.select} handleChange={handleChange} formData={formData} errors={errors} />
          {/* Age */}
          <SelectField label={text.age} name="age" options={Array.from({ length: 35 }, (_, i) => 35 - i)} selectText={text.select} handleChange={handleChange} formData={formData} errors={errors} />
          {/* Mobile */}
          <div className="flex flex-col">
            <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">
              {text.mobile}
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder={"987XXXX210"}
              className="border border-gray-300 bg-[rgba(236,234,234,1)] 
               text-gray-900 placeholder-gray-500
               p-2 rounded-lg w-full focus:outline-none focus:border-[#3355AE]"
              required
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">
              {text.wmobile}
            </label>
            <input
              type="text"
              name="wmobile"
              value={formData.wmobile}
              onChange={handleChange}
              placeholder={"987XXXX210"}
              className="border border-gray-300 bg-[rgba(236,234,234,1)] 
               text-gray-900 placeholder-gray-500
               p-2 rounded-lg w-full focus:outline-none focus:border-[#3355AE]"
              required
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">
              {text.Mailid}
            </label>
            <input
              type="email"
              name="Mailid"
              value={formData.Mailid}
              onChange={handleChange}
              placeholder={"ABC@gmail.com"}
              className="border border-gray-300 bg-[rgba(236,234,234,1)] 
               text-gray-900 placeholder-gray-500
               p-2 rounded-lg w-full focus:outline-none focus:border-[#3355AE]"
            />
            {errors.Mailid && (
              <p className="text-red-500 text-sm mt-1">{errors.Mailid}</p>
            )}
          </div>

          {/* UDID */}
          <div className="flex flex-col">
            <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">
              {text.udid}
            </label>
            <input
              type="text"
              name="udid"
              value={formData.udid}
              onChange={handleChange}
              placeholder={
                "TNXXXXXXXXXXXXXX"
              }
              className="border border-gray-300 bg-[rgba(236,234,234,1)] 
               text-gray-900 placeholder-gray-500
               p-2 rounded-lg w-full focus:outline-none focus:border-[#3355AE]"
              required
            />
            {errors.udid && (
              <p className="text-red-500 text-sm mt-1">{errors.udid}</p>
            )}
          </div>


          {/* Disability */}
          <SelectField label={text.disability} name="disability" options={text.disabilities} selectText={text.select} handleChange={handleChange} formData={formData} errors={errors} />
          {/* District */}
          <SelectField label={text.district} name="district" options={text.districts} selectText={text.select} handleChange={handleChange} formData={formData} errors={errors} />
          {/* Address */}
          <div className="md:col-span-2 w-full">
            <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">
              {text.address}
            </label>
            <textarea
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={
                language === "English"
                  ? "Door No., Street, City, State, Pincode"
                  : "வீட்டு எண்., தெரு, நகரம், மாநிலம், அஞ்சல் குறியீடு"
              }
              className="border border-gray-300 bg-[rgba(236,234,234,1)] p-3 rounded-lg w-full focus:outline-none focus:border-[#3355AE] text-gray-800"
              required
            />
          </div>
          {/* Description - Full Width with 250 Character Limit */}
          <div className="md:col-span-2 w-full">
            <label className="block text-gray-700 font-semibold mb-2">
              {language === "English"
                ? "Description about Talent Video *"
                : " நீங்கள் பதிவேற்ற உள்ள திறமை வீடியோவிற்கான சிறு குறிப்பு *"}
            </label>

            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              rows={5}
              maxLength={250}
              placeholder={
                language === "English"
                  ? "Enter About the video here..."
                  : "நீங்கள் பதிவேற்ற உள்ள திறமை வீடியோவிற்கான சிறு குறிப்பு"
              }
              className="border border-gray-300 bg-[rgba(236,234,234,1)] p-3 rounded-lg w-full focus:outline-none focus:border-[#3355AE] text-gray-800"
              required
            />

            <p className="text-right text-sm text-gray-500 mt-1">
              {formData.Description?.length || 0}/250{" "}
              {language === "English" ? "characters" : "எழுத்துகள்"}
            </p>
          </div>
        </div>
        <div className="px-8">
          <label
            className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-2 block tracking-[0.05em]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {text.uploadLabel}
          </label>

          <div
            onDrop={(e) => {
              e.preventDefault();
              validateAndPreviewFile(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-400 rounded-md p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-all"
          >
            <input
              type="file"
              id="fileUpload"
              name="file"
              accept=".mp4,.mov,.avi"
              onChange={(e) => {
                validateAndPreviewFile(e.target.files[0]);
                e.target.value = ""; // Clear input so same file can be selected again
              }}
              className="hidden"
            />

            <label
              htmlFor="fileUpload"
              className="cursor-pointer flex flex-col items-center text-gray-600"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-3"
              >
                <path
                  d="M20 5V25M20 5L28.3333 13.3333M20 5L11.6667 13.3333M35 25V31.6667C35 32.5507 34.6488 33.3986 34.0237 34.0237C33.3986 34.6488 32.5507 35 31.6667 35H8.33333C7.44928 35 6.60143 34.6488 5.97631 34.0237C5.35119 33.3986 5 32.5507 5 31.6667V25"
                  stroke="#8E8E8A"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span
                className="font-medium text-[16px] tracking-[0.05em]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {text.uploadText}
              </span>
              <p className="text-xs text-gray-500 mt-1">{text.fileType}</p>
            </label>

            {formData.file && (
              <p
                className="mt-3 text-sm font-medium text-green-600"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                ✅ {text.uploaded} {formData.file.name}
              </p>
            )}
          </div>

          {errors.file && (
            <p className="text-red-500 text-sm mt-2">{errors.file}</p>
          )}

          {/* ✅ File Preview */}
          {filePreview && (
            <div className="mt-4 w-full flex flex-col items-center">
              {/* VIDEO Preview */}
              {["mp4", "mov", "avi"].includes(filePreview.type) && (
                <video
                  controls
                  src={filePreview.url}
                  className="w-full max-w-[400px] rounded-md border border-gray-300 shadow-sm"
                />
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => {
                  // 🔓 Free the blob URL from memory before clearing
                  if (filePreview && filePreview.url) {
                    URL.revokeObjectURL(filePreview.url);
                  }
                  setFilePreview(null);
                  setFormData((prev) => ({ ...prev, file: null })); // Use functional update
                }}
                className="mt-2 px-4 py-2 text-sm text-red-600 font-semibold border border-red-400 rounded-md hover:bg-red-50"
              >
                Remove File
              </button>
            </div>
          )}
        </div>

        {/* Declaration */}
        <div className="px-6 md:px-10 py-6">
          <div className="flex gap-4 items-start">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="accent-[#3355AE] w-6 h-6 mt-[3px]"
              required
            />
            <p className="text-gray-700 text-[13px] md:text-[14px]">{text.declaration}</p>
          </div>
        </div>
        {errors.general && <p className="text-red-500 text-center mt-3 font-medium">{errors.general}</p>}
        {/* Buttons */}
        <div className="px-6 md:px-10 py-8 flex flex-col md:flex-row justify-center items-center gap-6">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full md:w-[404px] h-[50px] rounded-[16px] border font-semibold text-gray-700 hover:bg-gray-100"
            style={{ borderColor: "rgba(8, 104, 204, 1)" }}
          >
            {text.reset}
          </button>
          {/* Reset Confirmation Popup */}
          {showResetConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

              <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-[90%] max-w-md p-6 md:p-8 animate-fadeIn">

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 text-center">
                  {language === "English" ? "Reset Form?" : "படிவத்தை மீட்டமைக்கவா?"}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-base leading-relaxed text-center mb-8">
                  {language === "English"
                    ? "Are you sure you want to clear all the entered details?"
                    : "உள்ளீட்டப்பட்ட அனைத்து விவரங்களையும் நீக்க விரும்புகிறீர்களா?"}
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4">

                  {/* Cancel */}
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all"
                  >
                    {language === "English" ? "Cancel" : "ரத்து செய்"}
                  </button>

                  {/* Confirm Reset */}
                  <button
                    onClick={() => {
                      setShowResetConfirm(false);
                      handleReset();
                    }}
                    className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:opacity-90 transition-all"
                    style={{ backgroundColor: themeColor }}
                  >
                    {language === "English" ? "Yes, Reset" : "ஆம், ரீசெட்"}
                  </button>

                </div>
              </div>
            </div>
          )}


          <button
            type="submit"
            disabled={isUploading || isFormInvalid()}
            className={`w-full md:w-[404px] h-[50px] rounded-[16px] text-white font-semibold 
      ${(isUploading || isFormInvalid()) ? 'opacity-60 cursor-not-allowed' : ''}`
            }
            style={{ backgroundColor: themeColor }}
          >
            {isUploading ? text.uploadingButton : text.submit}
          </button>
        </div>
      </form>

      {/* Uploading overlay with progress */}
      {isUploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-lg w-[90%] max-w-md">
            <svg className="animate-spin h-10 w-10 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <p className="text-gray-800 text-lg font-medium">{text.uploadingOverlay}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>

            {/* Progress Percentage */}
            <p className="text-gray-600 font-semibold">{uploadProgress}%</p>

            {/* Upload Speed and Time Remaining */}
            <div className="text-center text-sm text-gray-600">
              <p>{text.speedLabel} {(uploadSpeed / (1024 * 1024)).toFixed(2)} MB/s</p>
              <p>{text.timeRemainingLabel} {uploadTimeRemaining > 0 ? `${Math.ceil(uploadTimeRemaining)}s` : '--'}</p>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-lg p-4 md:p-8 text-center animate-fadeIn flex flex-col items-center justify-center">

            {/* Success Icon */}
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
              {language === "English"
                ? "Registration Successful!"
                : "பதிவு வெற்றிகரமாக முடிந்தது!"}
            </h2>

            {/* Message */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 px-4">
              {language === "English"
                ? "Thank you for registering! Your details have been successfully submitted. We'll reach out soon."
                : "பதிவு செய்ததற்கு நன்றி! உங்கள் விவரங்கள் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டுள்ளன. விரைவில் தொடர்பு கொள்கிறோம்."}
            </p>

            {/* Button */}
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                setResponseMsg("");
                setErrors({});
                setFormData({
                  fullName: "",
                  firstName: "",
                  lastName: "",
                  mobile: "",
                  gender: "",
                  age: "",
                  district: "",
                  udid: "",
                  disability: "",
                  address: "",
                  Description: "",
                  file: null,
                  agree: false,
                });
                setFilePreview(null);
              }}
              className="bg-green-600 text-white px-20 py-3 rounded-xl font-medium text-lg hover:bg-green-700 transition-colors shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Popup - UDID Already Registered */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-lg p-4 md:p-8 text-center animate-fadeIn flex flex-col items-center justify-center">

            {/* Error Icon */}
            <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
              {language === "English"
                ? "Registration Error"
                : "பதிவு பிழை"}
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 px-4">
              {errorPopupMessage}
            </p>

            {/* Button */}
            <button
              onClick={() => {
                setShowErrorPopup(false);
                setErrorPopupMessage("");
              }}
              className="bg-red-600 text-white px-20 py-3 rounded-xl font-medium text-lg hover:bg-red-700 transition-colors shadow-md"
            >
              {language === "English" ? "OK" : "சரி"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// --- REUSABLE COMPONENTS ---
function Field({ label, name, handleChange, formData }) {
  return (
    <div className="flex flex-col">
      <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">{label}</label>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="border border-gray-300 bg-[rgba(236,234,234,1)] p-2 rounded-lg w-full"
        required
      />
    </div>
  );
}

function SelectField({ label, name, options, selectText, handleChange, formData, errors }) {
  return (
    <div className="flex flex-col">
      <label className="text-[14px] md:text-[16px] font-[500] text-gray-700 mb-3">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="border border-gray-300 bg-[rgba(236,234,234,1)] p-2 rounded-lg w-full"
        required
      >
        <option value="">{selectText}</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      {errors && errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );
}
