import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SettingUser.css";

export default function SettingUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    cardId: "",
    birthDate: "",
  });
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [touched, setTouched] = useState({});

  // Modal refs
  const saveSuccessRef = useRef(null);
  const notFoundRef = useRef(null);
  const loadErrorRef = useRef(null);

  // helper: show bootstrap modal
  const showBsModal = (ref, options = {}) => {
    const bootstrap = window.bootstrap;
    if (bootstrap?.Modal && ref?.current) {
      const inst = bootstrap.Modal.getOrCreateInstance(ref.current, {
        backdrop: "static",
        keyboard: false,
        ...options,
      });
      inst.show();
      return inst;
    }
    return null;
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch("/data/users.json");
        const all = await res.json();
        const found = Array.isArray(all)
          ? all.find((u) => String(u.id) === String(id))
          : null;

        if (!ignore) {
          if (found) {
            setUserName(found.name || "");
            setForm({
              firstName: found.firstName || "",
              lastName: found.lastName || "",
              cardId: found.cardId || "",
              birthDate: found.birthDate || "",
            });
          } else {
            // แทน alert ด้วย Bootstrap Modal (ไม่พบบุคคล)
            const inst = showBsModal(notFoundRef);
            if (inst) {
              notFoundRef.current.addEventListener(
                "hidden.bs.modal",
                () => navigate("/user"),
                { once: true }
              );
            } else {
              alert("ไม่พบบุคคลที่ต้องการแก้ไข");
              navigate("/user");
            }
          }
        }
      } catch (e) {
        if (!ignore) {
          // แทน alert ด้วย Bootstrap Modal (โหลดล้มเหลว)
          const inst = showBsModal(loadErrorRef);
          if (inst) {
            loadErrorRef.current.addEventListener(
              "hidden.bs.modal",
              () => navigate("/user"),
              { once: true }
            );
          } else {
            alert("โหลดข้อมูลไม่สำเร็จ");
            navigate("/user");
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardId") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 13);
      setForm((p) => ({ ...p, cardId: digitsOnly }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const onCancel = () => navigate(-1);

  const isCardIdValid = useMemo(() => /^\d{13}$/.test(form.cardId.trim()), [form.cardId]);
  const firstNameEmpty = useMemo(() => !form.firstName.trim(), [form.firstName]);
  const lastNameEmpty  = useMemo(() => !form.lastName.trim(),  [form.lastName]);
  const birthDateEmpty = useMemo(() => !form.birthDate.trim(), [form.birthDate]);

  const isFormComplete = useMemo(
    () => !firstNameEmpty && !lastNameEmpty && !birthDateEmpty && isCardIdValid,
    [firstNameEmpty, lastNameEmpty, birthDateEmpty, isCardIdValid]
  );

  const onSave = (e) => {
    e.preventDefault();
    // TODO: call API จริง
    console.log("SAVE", { id, ...form });

    // แสดง modal สำเร็จ
    const inst = showBsModal(saveSuccessRef);
    if (inst) {
      clearTimeout(window.__save_modal_to);
      window.__save_modal_to = setTimeout(() => inst.hide(), 2000);
    } else {
      alert("Saved!");
    }
  };

  return (
    <div className="setting-user">
      <div className="page-topbar">
        <div className="top-icons">
          <img src="/pictures/lang-en.png" alt="Language" />
          <img src="/pictures/notifications.png" alt="Notifications" />
          <img src="/pictures/settings.png" alt="Settings" />
        </div>
      </div>

      <h1 className="page-title">
        SETTING USER {userName ? `- ${userName}` : ""}
      </h1>

      <form id="setting-form" className="form-card" onSubmit={onSave}>
        <div className="form-grid">
          <div className="field">
            <label>First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="First Name"
              disabled={loading}
              aria-invalid={touched.firstName && firstNameEmpty ? "true" : "false"}
            />
            {touched.firstName && firstNameEmpty && (
              <span className="error-text">กรุณากรอก First Name</span>
            )}
          </div>

          <div className="field">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Last Name"
              disabled={loading}
              aria-invalid={touched.lastName && lastNameEmpty ? "true" : "false"}
            />
            {touched.lastName && lastNameEmpty && (
              <span className="error-text">กรุณากรอก Last Name</span>
            )}
          </div>

          <div className="field">
            <label>Card ID</label>
            <input
              name="cardId"
              value={form.cardId}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Card ID"
              maxLength={13}
              disabled={loading}
              inputMode="numeric"
              aria-invalid={
                touched.cardId && (form.cardId.trim() === "" || !isCardIdValid)
                  ? "true"
                  : "false"
              }
            />
            {touched.cardId && form.cardId.trim() === "" && (
              <span className="error-text">กรุณากรอก Card ID</span>
            )}
            {touched.cardId && form.cardId.trim() !== "" && !isCardIdValid && (
              <span className="error-text">Card ID ต้องเป็นตัวเลข 13 หลัก</span>
            )}
          </div>

          <div className="field">
            <label>Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={onChange}
              onBlur={onBlur}
              disabled={loading}
              aria-invalid={touched.birthDate && birthDateEmpty ? "true" : "false"}
            />
            {touched.birthDate && birthDateEmpty && (
              <span className="error-text">กรุณาเลือกวันเกิด</span>
            )}
          </div>
        </div>
      </form>

      <div className="actions-wrapper">
        <button type="button" className="btn ghost" onClick={onCancel}>
          CANCEL
        </button>
        <button
          type="submit"
          form="setting-form"
          className="btn primary"
          disabled={!isFormComplete || loading}
          title={!isFormComplete ? "กรอกข้อมูลให้ครบและถูกต้องก่อน" : "พร้อมบันทึก"}
        >
          SAVE
        </button>
      </div>

      {/* ===== Modal: Save Success ===== */}
      <div ref={saveSuccessRef} className="modal fade" id="saveSuccessModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0">
            <div className="modal-body text-center p-5">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
              </div>
              <h4 className="fw-bold mb-2">บันทึกข้อมูลสำเร็จ</h4>
              <p className="text-muted mb-4">ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
              <div className="d-flex justify-content-center gap-2">
                <button type="button" className="btn btn-success px-4" data-bs-dismiss="modal">
                  ปิด
                </button>
                <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal" onClick={() => navigate(-1)}>
                  กลับหน้าหลัก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Modal: Not Found (ไม่พบบุคคล) ===== */}
      <div ref={notFoundRef} className="modal fade" id="notFoundModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-body text-center p-4">
              <div className="mb-2">
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "3rem" }}></i>
              </div>
              <h5 className="fw-bold mb-2">ไม่พบบุคคลที่ต้องการแก้ไข</h5>
              <p className="text-muted mb-3">ระบบจะพาคุณกลับไปหน้าหลัก</p>
              <button type="button" className="btn btn-danger px-4" data-bs-dismiss="modal">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Modal: Load Error (โหลดข้อมูลไม่สำเร็จ) ===== */}
      <div ref={loadErrorRef} className="modal fade" id="loadErrorModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-body text-center p-4">
              <div className="mb-2">
                <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "3rem" }}></i>
              </div>
              <h5 className="fw-bold mb-2">โหลดข้อมูลไม่สำเร็จ</h5>
              <p className="text-muted mb-3">โปรดลองใหม่อีกครั้ง หรือกลับไปหน้าหลัก</p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  data-bs-dismiss="modal"
                >
                  ปิด
                </button>
                <button
                  type="button"
                  className="btn btn-warning px-4"
                  data-bs-dismiss="modal"
                  onClick={() => navigate("/user")}
                >
                  กลับหน้าหลัก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ===== /Modals ===== */}
    </div>
  );
}
