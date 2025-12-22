'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PaymentProgressChart from '@/app/components/PaymentProgressChart';
import MediaGallery from '@/app/components/MediaGallery';

interface AdminDashboardProps {
    initialProjectCode?: string;
}

type ViewMode = 'list' | 'client-view' | 'edit';

interface Project {
    id: string;
    project_code: string;
    client_name: string;
    project_name: string;
    project_status: string;
    total_project_amount: number;
    amount_paid: number;
    created_at: string;
}

interface ClientData {
    id: string;
    project_code: string;
    client_name: string;
    project_name: string;
    total_project_amount: number;
    amount_paid: number;
    project_status: string;
    created_at: string;
    updated_at: string;
}

interface Update {
    id: string;
    project_code: string;
    title: string;
    description: string;
    links: string[];
    created_at: string;
    updated_at: string;
}

interface MediaItem {
    id: string;
    project_code: string;
    image_url: string;
    image_name?: string;
    uploaded_at: string;
}

export default function AdminDashboard({ initialProjectCode = '' }: AdminDashboardProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectCode, setProjectCode] = useState(initialProjectCode);
    const [loading, setLoading] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [updates, setUpdates] = useState<Update[]>([]);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch all projects
    const fetchAllProjects = async () => {
        setLoadingProjects(true);
        try {
            const response = await fetch('/api/admin/clients');
            const data = await response.json();

            if (response.ok) {
                console.log('Projects fetched:', data.clients);
                setProjects(data.clients || []);
            } else {
                console.error('Error fetching projects:', data.error);
                alert(`Error fetching projects: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            const errorMessage = error instanceof Error ? error.message : 'Network error';
            alert(`Error fetching projects: ${errorMessage}`);
        } finally {
            setLoadingProjects(false);
        }
    };

    // Fetch specific project data
    const fetchProjectData = async (code?: string) => {
        const codeToUse = code || projectCode;
        if (!codeToUse) {
            console.error('No project code provided');
            return;
        }

        console.log('Fetching project data for:', codeToUse);
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/project/${codeToUse}`);
            const data = await response.json();

            if (response.ok) {
                console.log('Project data fetched successfully');
                setClientData(data.client);
                setUpdates(data.updates || []);
                setMedia(data.media || []);
            } else {
                console.error('Error fetching project:', data.error);
                alert(`Error: ${data.error || 'Project not found'}`);
            }
        } catch (error) {
            console.error('Error fetching project data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Network error';
            alert(`Error fetching project data: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // Handle project click - show in client view
    const handleProjectClick = async (code: string) => {
        setProjectCode(code);
        await fetchProjectData(code);
        setViewMode('client-view');
    };

    // Fetch all projects on mount
    useEffect(() => {
        fetchAllProjects();
    }, []);

    // Fetch project data when projectCode changes and we're in client-view or edit mode
    useEffect(() => {
        if (projectCode && (viewMode === 'client-view' || viewMode === 'edit')) {
            fetchProjectData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectCode, viewMode]);

    const handleUpdateProject = async () => {
        if (!clientData) return;

        try {
            const response = await fetch(`/api/admin/project/${projectCode}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: clientData.client_name,
                    projectName: clientData.project_name,
                    totalProjectAmount: clientData.total_project_amount,
                    amountPaid: clientData.amount_paid,
                    projectStatus: clientData.project_status,
                }),
            });

            if (response.ok) {
                alert('Project updated successfully!');
                fetchProjectData();
            } else {
                alert('Error updating project');
            }
        } catch {
            alert('Error updating project');
        }
    };

    const handleSaveUpdate = async (updateData: { title: string; description: string; links: string[] }) => {
        try {
            const url = editingUpdate
                ? '/api/admin/updates'
                : '/api/admin/updates';
            const method = editingUpdate ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...updateData,
                    id: editingUpdate?.id,
                    projectCode,
                }),
            });

            if (response.ok) {
                alert('Update saved successfully!');
                setShowUpdateForm(false);
                setEditingUpdate(null);
                fetchProjectData();
            } else {
                alert('Error saving update');
            }
        } catch {
            alert('Error saving update');
        }
    };

    const handleDeleteUpdate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this update?')) return;

        try {
            const response = await fetch(`/api/admin/updates?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Update deleted successfully!');
                fetchProjectData();
            } else {
                alert('Error deleting update');
            }
        } catch {
            alert('Error deleting update');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !projectCode) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectCode', projectCode);
        formData.append('imageName', file.name);

        try {
            const response = await fetch('/api/admin/media', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Image uploaded successfully!');
                fetchProjectData();
            } else {
                alert('Error uploading image');
            }
        } catch {
            alert('Error uploading image');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDeleteMedia = async (id: string, imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const response = await fetch(
                `/api/admin/media?id=${id}&imageUrl=${imageUrl}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                alert('Image deleted successfully!');
                fetchProjectData();
            } else {
                alert('Error deleting image');
            }
        } catch {
            alert('Error deleting image');
        }
    };

    // Projects List View
    if (viewMode === 'list') {
        return (
            <div className="min-h-screen bg-slate-50">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                            <p className="text-sm text-slate-600">
                                {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {loadingProjects ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                                <p className="text-slate-600">Loading projects...</p>
                            </div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
                            <p className="text-slate-600">No projects found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => handleProjectClick(project.project_code)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                                {project.project_name}
                                            </h3>
                                            <p className="text-sm text-slate-600 mb-2">
                                                {project.client_name}
                                            </p>
                                            <p className="text-xs font-mono text-slate-500">
                                                {project.project_code}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                project.project_status === 'Delivered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : project.project_status === 'Testing'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : project.project_status === 'Development'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            {project.project_status}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">Progress</span>
                                            <span className="font-semibold text-slate-900">
                                                {project.total_project_amount > 0
                                                    ? Math.round(
                                                          (project.amount_paid /
                                                              project.total_project_amount) *
                                                              100
                                                      )
                                                    : 0}
                                                %
                                            </span>
                                        </div>
                                        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                                            <div
                                                className="bg-slate-900 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${
                                                        project.total_project_amount > 0
                                                            ? (project.amount_paid /
                                                                  project.total_project_amount) *
                                                              100
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                            <span>
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                }).format(project.amount_paid)}
                                            </span>
                                            <span>
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                }).format(project.total_project_amount)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <p className="text-xs text-slate-500">
                                            Click to view client dashboard
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading project data...</p>
                </div>
            </div>
        );
    }

    // Client View Mode (Read-only, exactly as clients see it)
    if (viewMode === 'client-view' && clientData) {
        const getStatusColor = (status: string) => {
            const colors: Record<string, string> = {
                Planning: 'bg-blue-100 text-blue-800',
                Development: 'bg-purple-100 text-purple-800',
                Testing: 'bg-amber-100 text-amber-800',
                Delivered: 'bg-green-100 text-green-800',
            };
            return colors[status] || 'bg-slate-100 text-slate-800';
        };

        return (
            <div className="min-h-screen bg-slate-50">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        setViewMode('list');
                                        setClientData(null);
                                        setProjectCode('');
                                    }}
                                    className="text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        />
                                    </svg>
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">
                                        {clientData.client_name}
                                    </h1>
                                    <p className="text-sm text-slate-600">{clientData.project_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500">Client View</span>
                                <button
                                    onClick={() => setViewMode('edit')}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                                >
                                    Edit Mode
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Project Overview & Payment */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Project Overview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                    Project Overview
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Client Name</p>
                                        <p className="text-base font-medium text-slate-900">
                                            {clientData.client_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Project Name</p>
                                        <p className="text-base font-medium text-slate-900">
                                            {clientData.project_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Project Code</p>
                                        <p className="text-base font-medium text-slate-900 font-mono">
                                            {clientData.project_code}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Status</p>
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                clientData.project_status
                                            )}`}
                                        >
                                            {clientData.project_status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Chart */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <PaymentProgressChart
                                    totalAmount={clientData.total_project_amount || 0}
                                    amountPaid={clientData.amount_paid || 0}
                                />
                            </motion.div>

                            {/* Updates & Notes */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                            >
                                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                    Updates & Notes
                                </h2>
                                {updates.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">No updates yet</p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Your project manager will post updates here
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {updates.map((update, index) => (
                                            <motion.div
                                                key={update.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                className="border-l-4 border-slate-900 pl-4 py-2"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {update.title}
                                                    </h3>
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(update.created_at).toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 text-sm mb-3 whitespace-pre-line">
                                                    {update.description}
                                                </p>
                                                {update.links && update.links.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {update.links.map((link: string, linkIndex: number) => (
                                                            <a
                                                                key={linkIndex}
                                                                href={link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-md transition-colors inline-flex items-center gap-1"
                                                            >
                                                                <svg
                                                                    className="w-3 h-3"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                    />
                                                                </svg>
                                                                View Link
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Right Column - Media Gallery */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <MediaGallery media={media} />
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Edit Mode (Admin editing capabilities)
    if (!clientData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600">Loading project data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setViewMode('list');
                                    setClientData(null);
                                    setProjectCode('');
                                }}
                                className="text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setViewMode('client-view')}
                                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-300 transition-colors"
                            >
                                Client View
                            </button>
                            <span className="text-xs text-slate-500">Edit Mode</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Overview - Editable */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Project Overview
                                </h2>
                                <button
                                    onClick={handleUpdateProject}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Client Name
                                    </label>
                                    <input
                                        type="text"
                                        value={clientData.client_name || ''}
                                        onChange={(e) =>
                                            setClientData({
                                                ...clientData,
                                                client_name: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={clientData.project_name || ''}
                                        onChange={(e) =>
                                            setClientData({
                                                ...clientData,
                                                project_name: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Total Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={clientData.total_project_amount || 0}
                                        onChange={(e) =>
                                            setClientData({
                                                ...clientData,
                                                total_project_amount: Number(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Amount Paid
                                    </label>
                                    <input
                                        type="number"
                                        value={clientData.amount_paid || 0}
                                        onChange={(e) =>
                                            setClientData({
                                                ...clientData,
                                                amount_paid: Number(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={clientData.project_status || 'Planning'}
                                        onChange={(e) =>
                                            setClientData({
                                                ...clientData,
                                                project_status: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                                    >
                                        <option value="Planning">Planning</option>
                                        <option value="Development">Development</option>
                                        <option value="Testing">Testing</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Chart */}
                        <PaymentProgressChart
                            totalAmount={clientData.total_project_amount || 0}
                            amountPaid={clientData.amount_paid || 0}
                        />

                        {/* Updates - Editable */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Updates & Notes
                                </h2>
                                <button
                                    onClick={() => {
                                        setEditingUpdate(null);
                                        setShowUpdateForm(true);
                                    }}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                                >
                                    + Add Update
                                </button>
                            </div>

                            {showUpdateForm && (
                                <UpdateForm
                                    update={editingUpdate}
                                    onSave={handleSaveUpdate}
                                    onCancel={() => {
                                        setShowUpdateForm(false);
                                        setEditingUpdate(null);
                                    }}
                                />
                            )}

                            <div className="space-y-4 mt-6">
                                {updates.map((update) => (
                                    <div
                                        key={update.id}
                                        className="border-l-4 border-slate-900 pl-4 py-2 bg-slate-50 rounded-r-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-900">
                                                {update.title}
                                            </h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingUpdate(update);
                                                        setShowUpdateForm(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUpdate(update.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm mb-2 whitespace-pre-line">
                                            {update.description}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(update.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Media */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Project Media
                                </h3>
                                <label className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors cursor-pointer">
                                    {uploading ? 'Uploading...' : '+ Upload'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <MediaGallery media={media} onDelete={handleDeleteMedia} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Update Form Component
function UpdateForm({
    update,
    onSave,
    onCancel,
}: {
    update?: Update | null;
    onSave: (data: { title: string; description: string; links: string[] }) => void;
    onCancel: () => void;
}) {
    const [title, setTitle] = useState(update?.title || '');
    const [description, setDescription] = useState(update?.description || '');
    const [links, setLinks] = useState(update?.links?.join('\n') || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            description,
            links: links.split('\n').filter((link: string) => link.trim()),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-lg space-y-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Links (one per line)
                </label>
                <textarea
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    placeholder="https://example.com&#10;https://another-link.com"
                />
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-300 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

