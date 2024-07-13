import React from 'react';
import { DefaultLayout } from '../layouts/DefaultLayout';
import {Navigate, Route, Routes} from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import {NotFoundPage} from '../pages/NotFoundPage/NotFoundPage';
import PermissionDeniedPage from '../pages/PermissionDeniedPage/PermissionDeniedPage';
import DiamondsPage from '../pages/DiamondsPage/DiamondsPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/SignUpPage/SignUp';
import MaterialPage from '../pages/MaterialPage/MaterialPage';
import PrivateRoute from './PrivateRoute';
import ShellPage from '../pages/ShellPage/ShellPage';
import ProductPage from '../pages/ProductPage/ProductPage';

export const AppRouters = () => {
	return (
		<DefaultLayout>
			<Routes>
				<Route path="/" element={<Navigate to="/products" />} />
				<Route
					path="/diamonds"
					element={
						// <PrivateRoute>
							<DiamondsPage />
						// </PrivateRoute>
					}
				/>
				<Route
					path="/shells"
					element={
						// <PrivateRoute>
							<ShellPage />
						// </PrivateRoute>
					}
				/>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route
					path="/materials"
					element={
						// <PrivateRoute>
							<MaterialPage />
						// </PrivateRoute>
					}
				/>
				<Route
					path="/products"
					element={
						// <PrivateRoute>
							<ProductPage />
						// </PrivateRoute>
					}
				/>
				<Route path="/permission-denied" element={<PermissionDeniedPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</DefaultLayout>
	);
};
