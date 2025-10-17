import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { usePuterStore } from '~/lib/puter';
import { Summary } from '~/components/Summary';
import { ATS } from '~/components/ATS';
import { Details } from '~/components/Details';

export const meta = () => [
    { title: 'Resumind | Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
];

const Resume = (): JSX.Element => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth?.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [auth, isLoading, navigate, id]);

    useEffect(() => {
        const loadResume = async () => {
            const resumeData: any = await kv.get(`resume:${id}`);
            if (!resumeData) return;

            const data = JSON.parse(resumeData);

            // Load resume PDF
            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;
            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            // Load image preview
            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            // Set feedback data
            setFeedback(data.feedback);
        };

        loadResume();
    }, [id, fs, kv]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button flex items-center gap-2">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-100 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-screen sticky top-0 flex flex-col items-center justify-center">
                    <h2 className="text-4xl text-black font-bold mb-8">Resume Review</h2>

                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" alt="loading" className="w-full max-w-sm" />
                    )}
                </section>

                {imageUrl && resumeUrl && (
                    <div className="animate-in fade-in duration-1000 gradient-border m-4 h-[90%] w-fit">
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                            <img
                                src={imageUrl}
                                className="w-full h-full object-contain rounded-2xl"
                                alt="resume"
                            />
                        </a>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Resume;
