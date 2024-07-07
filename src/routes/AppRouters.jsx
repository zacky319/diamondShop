import React from 'react';
import { DefaultLayout } from '../layouts/DefaultLayout';
import {Navigate, Route, Routes} from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import {NotFoundPage} from '../pages/NotFoundPage/NotFoundPage';
import PermissionDeniedPage from '../pages/PermissionDeniedPage/PermissionDeniedPage';
import {DiamondsPage} from '../pages/DiamondsPage/DiamondsPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/SignUpPage/SignUp';
import {UserPage} from '../pages/EventPage/UserPage';
import {ReportPage} from '../pages/ReportPage/ReportPage';
import AdPage from '../pages/AdPage/AdPage';
import PostPage from '../pages/PostPage/PostPage';
import TransactionPage from '../pages/TransactionPage/TransactionPage';
import VoucherPage from '../pages/VoucherPage/VoucherPage';
import PrivateRoute from './PrivateRoute';
import { StadiumPage } from '../pages/StadiumPage/StadiumPage';

export const AppRouters = () => {
	return (
		<DefaultLayout>
			<Routes>
				<Route path="/" element={<Navigate to="/diamonds" />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<DashboardPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/diamonds"
					element={
						<PrivateRoute>
							<DiamondsPage />
						</PrivateRoute>
					}
				/>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route
					path="/matches"
					element={
						<PrivateRoute>
							<UserPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/ads"
					element={
						<PrivateRoute>
							<AdPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/reports"
					element={
						<PrivateRoute>
							<ReportPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/posts"
					element={
						<PrivateRoute>
							<PostPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/transactions"
					element={
						<PrivateRoute>
							<TransactionPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/stadiums"
					element={
						<PrivateRoute>
							<StadiumPage />
						</PrivateRoute>
					}
				/>
				<Route
					path="/vouchers"
					element={
						<PrivateRoute>
							<VoucherPage />
						</PrivateRoute>
					}
				/>

				<Route path="/permission-denied" element={<PermissionDeniedPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</DefaultLayout>
	);
};
