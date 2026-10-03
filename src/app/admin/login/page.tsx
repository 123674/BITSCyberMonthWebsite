import Image from 'next/image';
import LoginForm from './LoginForm';

type PageProps = {
    searchParams: Promise<{ next?: string | string[] }>;
};

const AdminLoginPage = async ({ searchParams }: PageProps) => {
    const { next } = await searchParams;

    return (
        <main className="login-page">
            <style>{`
                .login-page {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    box-sizing: border-box;
                    background: radial-gradient(ellipse at top, #0f1b3d 0%, #000 70%);
                    font-family: 'Space Grotesk', system-ui, sans-serif;
                    color: #e2e8f0;
                }
                .login-card {
                    width: 100%;
                    max-width: 380px;
                    padding: 2.25rem 2rem;
                    border-radius: 18px;
                    background: rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(96, 165, 250, 0.25);
                    box-shadow: 0 0 60px rgba(99, 102, 241, 0.18);
                    text-align: center;
                }
                .login-card h1 {
                    font-family: var(--font-heading), 'Space Grotesk', system-ui, sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin: 1rem 0 0.25rem;
                    background: linear-gradient(135deg, #60a5fa 0%, #a855f7 60%, #c084fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .login-card > p {
                    margin: 0 0 1.75rem;
                    color: rgba(200, 210, 230, 0.7);
                    font-size: 0.95rem;
                }
                .login-form {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                }
                .login-form label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 0.35rem;
                    color: #cbd5e1;
                }
                .login-form input:not([type=hidden]) {
                    padding: 0.75rem 0.9rem;
                    margin-bottom: 1.1rem;
                    border-radius: 10px;
                    border: 1px solid rgba(96, 165, 250, 0.3);
                    background: rgba(2, 6, 23, 0.7);
                    color: #f1f5f9;
                    font: inherit;
                    outline: none;
                }
                .login-form input:focus {
                    border-color: rgba(168, 85, 247, 0.7);
                    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
                }
                .login-form button {
                    margin-top: 0.4rem;
                    padding: 0.8rem;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
                    color: #fff;
                    font: inherit;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    cursor: pointer;
                }
                .login-form button:disabled {
                    opacity: 0.7;
                    cursor: wait;
                }
                .login-error {
                    margin: -0.3rem 0 0.8rem;
                    color: #fca5a5;
                    font-size: 0.9rem;
                }
            `}</style>

            <div className="login-card">
                <Image src="/ieee-cs-logo.png" alt="IEEE Computer Society logo" width={56} height={56} priority />
                <h1>Admin Login</h1>
                <p>Cyber Month 2026 event management</p>
                <LoginForm next={typeof next === 'string' ? next : '/admin'} />
            </div>
        </main>
    );
};

export default AdminLoginPage;
