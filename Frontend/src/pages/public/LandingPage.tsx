import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Welcome to Rooman ERP
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Streamline your university operations with our comprehensive Enterprise Resource Planning system
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/enquiry"
                                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-purple-600 hover:shadow-xl transition-all duration-300"
                            >
                                Make an Enquiry
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
                        Powerful Features for Modern Education
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Student Management</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Comprehensive student information system with attendance tracking, grade management, and course enrollment.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Employee Portal</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Manage faculty and staff with attendance, payroll, leave management, and task assignment features.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Centralized control panel with analytics, reports, user management, and system-wide settings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6 text-gray-800">
                                Why Choose Rooman ERP?
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Real-time Updates</h3>
                                        <p className="text-gray-600">Stay informed with instant notifications and live data synchronization across all modules.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Role-based Access</h3>
                                        <p className="text-gray-600">Secure, customized dashboards for students, employees, and administrators.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Comprehensive Reports</h3>
                                        <p className="text-gray-600">Generate detailed analytics and insights to make data-driven decisions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-white">
                            <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Institution?</h3>
                            <p className="text-lg mb-8 opacity-90">
                                Join hundreds of educational institutions already using Rooman ERP to streamline their operations.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">R</span>
                        </div>
                        <span className="text-2xl font-bold">Rooman ERP</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Empowering educational institutions with cutting-edge technology
                    </p>
                    <p className="text-gray-500 text-sm">
                        © 2026 Rooman ERP. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
