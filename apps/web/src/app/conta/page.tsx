"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";

type Mode = "login" | "register" | "recover";
type FieldName = "fullName" | "email" | "password" | "confirmPassword";
type Errors = Partial<Record<FieldName, string>>;

function AccountField({ name, label, error, mode, onEdit }: {
  name: FieldName; label: string; error?: string; mode: Mode; onEdit: (name: FieldName) => void;
}) {
  const [visible, setVisible] = useState(false);
  const password = name === "password" || name === "confirmPassword";
  const id = `account-${name}`;
  return <div className="account-field">
    <label htmlFor={id} className="mb-2 block text-xs">{label}</label>
    <div className="relative">
      <input id={id} name={name} type={password ? visible ? "text" : "password" : name === "email" ? "email" : "text"}
        placeholder={name === "email" ? "voce@exemplo.com" : name === "fullName" ? "Como podemos chamar você?" : name === "confirmPassword" ? "Repita sua senha" : mode === "register" ? "Crie uma senha" : "Digite sua senha"}
        autoComplete={name === "fullName" ? "name" : name === "email" ? "email" : mode === "login" ? "current-password" : "new-password"}
        autoCapitalize={name === "fullName" ? "words" : "none"} spellCheck={false} required
        minLength={password && mode === "register" ? 8 : undefined} maxLength={password ? 128 : name === "email" ? 254 : 100}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : name === "password" && mode === "register" ? "account-password-hint" : undefined}
        onInput={() => onEdit(name)} className={`h-12 w-full rounded-none border bg-white px-3 text-base transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black ${password ? "pr-12" : ""} ${error ? "border-[#a43b32]" : "border-[#d9d5cf]"}`} />
      {password && <button type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? "Ocultar" : "Mostrar"} ${name === "confirmPassword" ? "confirmação de senha" : "senha"}`} aria-pressed={visible} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted hover:text-black"><Icon name={visible ? "eye-off" : "eye"} size={19} /></button>}
    </div>
    {error && <p id={`${id}-error`} className="mt-2 text-xs text-[#a43b32]">{error}</p>}
    {name === "password" && mode === "register" && !error && <p id="account-password-hint" className="mt-2 text-[11px] text-muted">Use pelo menos 8 caracteres.</p>}
  </div>;
}

export default function AccountPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const noticeRef = useRef<HTMLParagraphElement>(null);

  function changeMode(value: Mode) { setMode(value); setErrors({}); setNotice(""); }
  function edit(name: FieldName) {
    setErrors((previous) => ({ ...previous, [name]: undefined, ...(name === "password" ? { confirmPassword: undefined } : {}) }));
    setNotice("");
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    const next: Errors = {};
    if (mode === "register" && String(data.get("fullName") ?? "").trim().length < 3) next.fullName = "Informe seu nome completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") ?? "").trim())) next.email = "Informe um e-mail válido.";
    if (mode !== "recover" && !password) next.password = "Informe sua senha.";
    else if (mode === "register" && password.length < 8) next.password = "A senha precisa ter pelo menos 8 caracteres.";
    if (mode === "register" && String(data.get("confirmPassword") ?? "") !== password) next.confirmPassword = "As senhas precisam ser iguais.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) { (form.elements.namedItem(first) as HTMLInputElement | null)?.focus(); return; }
    form.reset();
    setNotice(mode === "recover" ? "E-mail validado. Esta é uma demonstração: nenhum link de recuperação foi enviado." : mode === "register" ? "Campos validados! Esta é uma demonstração: nenhuma conta foi criada e seus dados não foram salvos." : "Campos validados! O acesso real ainda não está disponível nesta demonstração. Seus dados não foram salvos.");
    requestAnimationFrame(() => noticeRef.current?.focus());
  }

  return <main id="conteudo" className="account-page">
    <div className="account-topline"><nav aria-label="Caminho da página"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Minha conta</span></nav><span className="account-topline-note">SEU ESTILO. SEU ESPAÇO.</span></div>
    <div className="account-layout">
      <aside aria-label="Campanha Essen Fashion" className="account-editorial">
        <Image src="/images/campaign/model-rio.webp" alt="Modelo com vestido rosa em um terraço com vista para o Rio de Janeiro" fill priority sizes="(min-width: 901px) 50vw, 100vw" className="account-campaign-image" />
        <div className="account-image-shade" />
        <div className="account-editorial-top"><span>ESSEN JOURNAL</span><span>RIO DE JANEIRO, BRASIL</span></div>
        <div className="account-editorial-copy"><span className="account-eyebrow">UM NOVO OLHAR PARA O SEU ESTILO</span><h2>O próximo capítulo<br />é <em>todo seu.</em></h2><p>Peças que acompanham a vida.<br />Encontros que revelam você.</p><Link href="/#colecao">DESCUBRA A COLEÇÃO <Icon name="arrow" size={19} /></Link></div>
        <div className="account-image-caption"><span>ESSÊNCIA EM CADA DETALHE</span><span>01 — 03</span></div>
      </aside>
      <section aria-labelledby="account-title" className="account-form-section"><div className="account-form-content">
        <div className="account-welcome-mark" aria-hidden="true">e.</div>
        <p className="account-eyebrow">SUA CONEXÃO COM A ESSEN</p>
        <h1 id="account-title">{mode === "recover" ? <>Vamos recomeçar<span>com tranquilidade.</span></> : mode === "register" ? <>Seu novo capítulo<span>começa aqui.</span></> : <>Que bom ter<span>você por aqui.</span></>}</h1>
        <p className="account-description">{mode === "recover" ? "Informe seu e-mail para recuperar o acesso à sua conta." : mode === "register" ? "Crie sua conta e descubra novas possibilidades de vestir." : "Entre na sua conta e reencontre o que faz seu estilo."}</p>
        {mode !== "recover" && <div role="tablist" aria-label="Acessar sua conta" className="account-tabs">{([{ value: "login", label: "Entrar" }, { value: "register", label: "Criar conta" }] as const).map((tab) => <button key={tab.value} id={`account-tab-${tab.value}`} type="button" role="tab" aria-selected={mode === tab.value} aria-controls="account-panel" tabIndex={mode === tab.value ? 0 : -1} onClick={() => changeMode(tab.value)} onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const value = event.key === "Home" ? "login" : event.key === "End" ? "register" : mode === "register" ? "login" : "register";
          changeMode(value); document.getElementById(`account-tab-${value}`)?.focus();
        }}>{tab.label}</button>)}</div>}
        <div id="account-panel" role={mode === "recover" ? "region" : "tabpanel"} aria-labelledby={mode === "recover" ? "account-title" : `account-tab-${mode}`}>
          <form key={mode} onSubmit={submit} noValidate aria-describedby="account-demo" className="account-form">
            {mode === "register" && <AccountField name="fullName" label="Nome completo" error={errors.fullName} mode={mode} onEdit={edit} />}
            <AccountField name="email" label="E-mail" error={errors.email} mode={mode} onEdit={edit} />
            {mode !== "recover" && <AccountField name="password" label="Senha" error={errors.password} mode={mode} onEdit={edit} />}
            {mode === "register" && <AccountField name="confirmPassword" label="Confirmar senha" error={errors.confirmPassword} mode={mode} onEdit={edit} />}
            {mode === "login" && <div className="account-form-options"><span>Seu próximo encontro com a moda.</span><button type="button" onClick={() => changeMode("recover")}>Esqueci minha senha</button></div>}
            <button type="submit" className="account-submit"><span>{mode === "register" ? "Criar minha conta" : mode === "recover" ? "Recuperar acesso" : "Entrar na minha conta"}</span><Icon name="arrow" size={20} /></button>
            {mode === "recover" && <button type="button" className="account-back" onClick={() => changeMode("login")}>Voltar para o login</button>}
          </form>
          <p ref={noticeRef} role="status" tabIndex={-1} className={notice ? "account-notice" : "sr-only"}>{notice}</p>
        </div>
        <p className="account-privacy">Ao continuar, você concorda com nossa <Link href="/ajuda#privacidade">Política de Privacidade</Link>.</p>
        <div className="account-divider"><span>SEMPRE DO SEU JEITO</span></div>
        <Link href="/#colecao" className="account-explore">Prefere só dar uma olhada? <span>Explore a coleção <Icon name="arrow" size={15} /></span></Link>
        <p id="account-demo" className="account-demo">Ambiente demonstrativo. Use dados fictícios. Nenhuma conta é criada e nenhum dado é salvo ou enviado.</p>
      </div></section>
    </div>
    <div className="account-bottomline"><span>FEITO PARA ACOMPANHAR VOCÊ</span><span>Novas possibilidades de vestir. A mesma essência.</span><Link href="/ajuda#atendimento">Precisa de ajuda? Fale com a Essen <Icon name="arrow" size={14} /></Link></div>
  </main>;
}
