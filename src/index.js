import _ from 'lodash';
import {createHistory} from 'history';
import React from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router';

import {pageData} from './settings';
import {registerDefaultCards} from './RegisterCards';
import configureStore from './store/configureStore';
import rootReducer from './reducers';

import {
    setCurrentSelectedProjectId,
    setCurrentSelectedProjectExternalId,
} from './actions/currentSelectedProject';

import ProjectDetails from './containers/ProjectDetails';
import ProjectList from './containers/ProjectList';
import Sidebar from './containers/Sidebar';
import FiltersSidebar from './containers/FiltersSidebar';
import Timeline from './routes/Timeline';

const mainContainer = document.querySelector('#main');
const sidebarContainer = document.querySelector('#sidebar');


pageData.filterProps = {
    title: 'Refine by…',
    filters: [
        {
            label: 'Test Label',
            name: 'test-key',
            type: 'UNION_FILTER',
            options: [{
                label: 'Yes',
                checked: false,
                count: 0,
            }, {
                label: 'No',
                checked: false,
                count: 1,
            }],
        },
        {
            label: 'Status',
            name: 'status',
            type: 'UNION_FILTER',
            options: [{
                label: 'Task was declined',
                checked: false,
                count: 2,
            }, {
                label: 'Past Due',
                checked: false,
                count: 4,
            }, {
                label: 'Needs an assignment',
                checked: false,
                count: 2,
            }],
        },
    ],
};

const routerHistory = createHistory();
const store = configureStore(
    rootReducer, {
        currentSelectedProgram: {
            programId: pageData.program_id,
        },
        currentSelectedProject: {
            projectId: pageData.project_id,
            projectExternalId: pageData.project_external_id,
        },
        currentSelectedFilters: {
            ...pageData.filterProps,
        },
    });

registerDefaultCards();

if (!mainContainer) {
    routerHistory.listenBefore(function refreshPageOnLocationChange(routerLocation) {
        window.location.pathname = routerLocation.pathname;
        return false;
    });
}

function setProjectState(nextState) {
    const projectId = parseInt(_.get(nextState, 'params.projectId'), 10);

    store.dispatch(setCurrentSelectedProjectId(projectId + ''));

    const projectExternalId = _.chain(store.getState().projectSummaries.data)
        .find(summary => summary.project.id === projectId)
        .get('project.external_id')
        .value();

    if (projectExternalId) {
        store.dispatch(setCurrentSelectedProjectExternalId(projectExternalId));
    }
}

function renderRoutes(routeConfig, parentNode) {
    const component = (
        <Provider store={store}>
            {() => <Router routes={routeConfig} history={routerHistory} />}
        </Provider>
    );

    React.render(component, parentNode);
}

export function initApp() {
    if (mainContainer) {
        renderRoutes(
            [
                {
                    path: '/manage/project/list/:programId/',
                    component: ProjectList,
                },
                {
                    path: '/manage/project/:projectId/',
                    component: ProjectDetails,
                    onEnter: setProjectState,
                },
                {
                    path: '/manage/project/:projectId/history/',
                    component: Timeline,
                    onEnter: setProjectState,
                },
            ],
            mainContainer
        );
    }

    renderRoutes(
        [
            {
                path: '/manage/project/list/:programId/',
                component: FiltersSidebar,
            },
            {
                path: '/manage/project/:projectId/',
                component: Sidebar,
            },
            {
                path: '/manage/project/:projectId/history/',
                component: Sidebar,
            },
            {
                path: '/manage/project/:projectId/premise/*',
                component: Sidebar,
            },
            {
                path: '/manage/project/:projectId/participant/*',
                component: Sidebar,
            },
        ],
        sidebarContainer
    );
}
