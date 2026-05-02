import { useAuth } from '../context/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import FacultyDashboard from './dashboards/FacultyDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function DashboardPage() {
    const { role } = useAuth();

    if (!role) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))',
                animation: 'pulse-ring 2s ease-out infinite',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem',
            }}>🎓</div>
        </div>
    );

    const DashboardComponent = {
        'STUDENT': StudentDashboard,
        'ADVISOR': FacultyDashboard,
        'HOD': FacultyDashboard,
        'PRINCIPAL': FacultyDashboard,
        'ADMIN': AdminDashboard
    }[role] || StudentDashboard;

    return <DashboardComponent />;
}

