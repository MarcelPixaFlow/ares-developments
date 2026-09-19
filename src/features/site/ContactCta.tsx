import { useEffect, useState, type FormEvent } from "react";
import { formatUSD } from "@/features/roi/projections";

const TICKETS = [100_000, 250_000, 1_000_000, 5_000_000] as const;

type Ticket = (typeof TICKETS)[number];

type Inquiry = {
  name: string;
  email: string;
  ticket: Ticket;
  message: string;
  recordedAt: string;
};

const STORAGE_KEY = "ares-inquiry";

function readStoredInquiry(): Inquiry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Inquiry;
  } catch {
    return null;
  }
}

export function ContactCta() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState<Ticket>(250_000);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    setInquiry(readStoredInquiry());
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) {
      setError("Informe nome e e-mail.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Informe um e-mail válido.");
      return;
    }

    const recorded: Inquiry = {
      name: trimmedName,
      email: trimmedEmail,
      ticket,
      message: message.trim(),
      recordedAt: new Date().toISOString(),
    };

    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(recorded));
    } catch {
      // Sem storage: o estado em tela ainda confirma o registro local.
    }

    setError(null);
    setInquiry(recorded);
  };

  const resetForm = () => {
    setInquiry(null);
    setError(null);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          Converse com um especialista da Ares
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Reunião privada sobre a tese e o veículo descritos acima.
        </p>
        <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted-foreground">
          Este formulário não envia e-mail e não há backend neste conceito.
          O pedido fica registrado apenas neste navegador, nesta sessão.
        </p>
        <a
          href="#tese"
          className="mt-8 inline-flex items-center justify-center border border-border px-8 py-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Rever a tese
        </a>
      </div>

      <div className="lg:col-span-7">
        {inquiry ? (
          <div
            className="border border-border bg-card p-8"
            role="status"
            aria-live="polite"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary">
              Pedido registrado neste navegador
            </p>
            <h3 className="mt-4 font-serif text-2xl text-foreground">
              Recebemos os dados localmente.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Nada foi enviado a um servidor. Não há fila de relações institucionais
              neste conceito ficcional. Segue o que ficou gravado nesta sessão:
            </p>
            <dl className="mt-8 grid gap-4 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Nome
                </dt>
                <dd className="mt-1 text-foreground">{inquiry.name}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  E-mail
                </dt>
                <dd className="mt-1 text-foreground">{inquiry.email}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Ticket
                </dt>
                <dd className="mt-1 tabular-nums text-foreground">
                  {formatUSD(inquiry.ticket)}
                </dd>
              </div>
              {inquiry.message ? (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Mensagem
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-foreground">
                    {inquiry.message}
                  </dd>
                </div>
              ) : null}
            </dl>
            <button
              type="button"
              onClick={resetForm}
              className="mt-8 inline-flex items-center justify-center border border-border px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Registrar outro pedido
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="grid gap-6 border border-border bg-card p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Nome
              </label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-3 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                E-mail
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-3 w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <fieldset>
              <legend className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Ticket
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {TICKETS.map((value) => {
                  const active = ticket === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTicket(value)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        active
                          ? "border-primary text-foreground"
                          : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {formatUSD(value)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Mensagem
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-3 w-full resize-y border border-border bg-transparent p-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            {error ? (
              <p className="text-sm text-primary" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center bg-primary px-8 py-4 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
            >
              Registrar pedido
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
