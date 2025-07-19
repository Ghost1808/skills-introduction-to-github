'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const features = [
    {
      icon: CalendarIcon,
      title: 'Gestión de Citas',
      description: 'Sistema avanzado de programación y seguimiento de citas médicas'
    },
    {
      icon: UserGroupIcon,
      title: 'Gestión de Pacientes',
      description: 'Registro completo y seguimiento del historial médico de pacientes'
    },
    {
      icon: DocumentTextIcon,
      title: 'Historiales Médicos',
      description: 'Registros médicos digitales seguros y organizados'
    },
    {
      icon: HeartIcon,
      title: 'Monitoreo de Salud',
      description: 'Seguimiento de signos vitales y resultados de laboratorio'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Seguridad de Datos',
      description: 'Protección avanzada de información médica sensible'
    },
    {
      icon: CogIcon,
      title: 'Administración',
      description: 'Herramientas completas de gestión y reportes'
    }
  ];

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ClinicApp</span>
            </div>
            <div className="space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Sistema de Gestión
            <span className="text-blue-600"> Clínica</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa para la gestión eficiente de clínicas y centros médicos. 
            Gestiona pacientes, citas, historiales médicos y mucho más.
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-block"
            >
              Comenzar Ahora
            </Link>
            <Link
              href="/login"
              className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold inline-block"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Completas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tu clínica de manera eficiente y profesional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para transformar tu clínica?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a cientos de profesionales de la salud que confían en ClinicApp
          </p>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold inline-block"
          >
            Registrarse Gratis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <HeartIcon className="h-6 w-6 text-blue-400" />
            <span className="ml-2 text-lg font-semibold">ClinicApp</span>
          </div>
          <p className="text-gray-400">
            © 2024 ClinicApp. Sistema de gestión clínica profesional.
          </p>
        </div>
      </footer>
    </div>
  );
}