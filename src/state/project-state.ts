import { Project, ProjectStatus } from "../models/project.js";

// Project state management class
type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );
        this.projects.push(newProject);
        this.updateListeners();
    }

    moveProject(id: string, newStatus: ProjectStatus) {
        const project = this.projects.find((prj) => prj.id === id);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        // run all listener functions when new projects are add.
        // acts as subscription service.
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice()); //slice to pass a copy
        }
    }
}

export const projectState = ProjectState.getInstance();
