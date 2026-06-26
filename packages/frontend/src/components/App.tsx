import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import '../styles/App.css'

type User = {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

type Project = {
  id: string
  ownerId: string
  name: string
  description: string | null
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

type ProjectMember = {
  userId: string
  name: string
  role: string
}

type Task = {
  id: string
  projectId: string
  creatorId: string
  assigneeId: string | null
  title: string
  description: string | null
  status: string
  priority: string
  createdAt: string
  updatedAt: string
}

type BoardStatus = 'created' | 'in_progress' | 'done'

const BOARD_COLUMNS: { id: BoardStatus; title: string }[] = [
  { id: 'created', title: 'To do' },
  { id: 'in_progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
]

const getBoardStatus = (status: string): BoardStatus => {
  if (status === 'done') return 'done'
  if (status === 'created') return 'created'
  return 'in_progress'
}

const api = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message ?? 'Request failed')
  }

  return response.json() as Promise<T>
}

function App() {
  const activeUserStorageKey = 'task-management-active-user'
  const minSidebarWidth = 240
  const maxSidebarWidth = 520
  const minTaskSidebarWidth = 240
  const maxTaskSidebarWidth = 480
  const [message, setMessage] = useState('Ready')
  const [knownUsers, setKnownUsers] = useState<User[]>([])
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
  const [activeUserId, setActiveUserId] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState('')
  const [isProjectSidebarCollapsed, setIsProjectSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isResizingSidebar, setIsResizingSidebar] = useState(false)
  const [taskSidebarWidth, setTaskSidebarWidth] = useState(320)
  const [isResizingTaskSidebar, setIsResizingTaskSidebar] = useState(false)
  const [isTaskSidebarCollapsed, setIsTaskSidebarCollapsed] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTaskId, setActiveTaskId] = useState('')
  const [draggedTaskId, setDraggedTaskId] = useState('')

  const [registerForm, setRegisterForm] = useState({
    login: '',
    password: '',
  })
  const [loginForm, setLoginForm] = useState({
    login: '',
    password: '',
  })
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
  })
  const [projectOwnerId, setProjectOwnerId] = useState('')
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigneeId: '',
  })

  const activeUser = useMemo(
    () => knownUsers.find((user) => user.id === activeUserId) ?? null,
    [knownUsers, activeUserId],
  )
  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [projects, activeProjectId],
  )
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId) ?? null,
    [tasks, activeTaskId],
  )
  const tasksByBoardStatus = useMemo(
    () =>
      BOARD_COLUMNS.reduce<Record<BoardStatus, Task[]>>(
        (accumulator, column) => {
          accumulator[column.id] = tasks.filter((task) => getBoardStatus(task.status) === column.id)
          return accumulator
        },
        { created: [], in_progress: [], done: [] },
      ),
    [tasks],
  )

  useEffect(() => {
    void handleAction(async () => {
      const result = await api<{ users: User[] }>('/users')
      setKnownUsers(result.users)
      const persistedUserId = window.localStorage.getItem(activeUserStorageKey)

      if (persistedUserId && result.users.some((user) => user.id === persistedUserId)) {
        setActiveUserId(persistedUserId)
      }
    })
  }, [])

  useEffect(() => {
    if (!activeUserId) {
      setProjectOwnerId('')
      window.localStorage.removeItem(activeUserStorageKey)
      return
    }

    window.localStorage.setItem(activeUserStorageKey, activeUserId)
    setProjectOwnerId((current) => current || activeUserId)
  }, [activeUserId])

  useEffect(() => {
    if (!activeUserId) {
      setProjects([])
      setProjectMembers([])
      setActiveProjectId('')
      setTasks([])
      setActiveTaskId('')
      return
    }

    void handleAction(() => loadProjects(activeUserId))
  }, [activeUserId])

  useEffect(() => {
    if (!projects.some((project) => project.id === activeProjectId)) {
      setActiveProjectId(projects[0]?.id ?? '')
    }
  }, [projects, activeProjectId])

  useEffect(() => {
    if (!activeProjectId || !activeUserId) {
      setProjectMembers([])
      return
    }

    void handleAction(() => loadProjectMembers(activeProjectId, activeUserId))
  }, [activeProjectId, activeUserId])

  useEffect(() => {
    if (!tasks.some((task) => task.id === activeTaskId)) {
      setActiveTaskId(tasks[0]?.id ?? '')
    }
  }, [tasks, activeTaskId])

  useEffect(() => {
    if (!activeProjectId || !activeUserId) {
      setTasks([])
      return
    }

    void handleAction(() => loadTasks(activeProjectId, activeUserId))
  }, [activeProjectId, activeUserId])

  useEffect(() => {
    if (!isResizingSidebar) {
      return undefined
    }

    const handleMouseMove = (event: MouseEvent) => {
      const nextWidth = Math.min(Math.max(event.clientX, minSidebarWidth), maxSidebarWidth)
      setSidebarWidth(nextWidth)
    }

    const handleMouseUp = () => {
      setIsResizingSidebar(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizingSidebar])

  useEffect(() => {
    if (!isResizingTaskSidebar) {
      return undefined
    }

    const handleMouseMove = (event: MouseEvent) => {
      const taskSidebarLeftEdge = sidebarWidth + 10
      const nextWidth = Math.min(
        Math.max(event.clientX - taskSidebarLeftEdge, minTaskSidebarWidth),
        maxTaskSidebarWidth,
      )
      setTaskSidebarWidth(nextWidth)
    }

    const handleMouseUp = () => {
      setIsResizingTaskSidebar(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizingTaskSidebar, sidebarWidth])

  const pushKnownUser = (user: User) => {
    setKnownUsers((current) => {
      if (current.some((item) => item.id === user.id)) {
        return current
      }

      return [...current, user]
    })
    setActiveUserId(user.id)
  }

  const loadProjects = async (userId = activeUserId) => {
    if (!userId) return
    const result = await api<{ projects: Project[] }>(`/projects/user/${userId}`)
    setProjects(result.projects)
    setMessage(`Loaded ${result.projects.length} projects`)
  }

  const loadTasks = async (projectId = activeProjectId, userId = activeUserId) => {
    if (!projectId || !userId) return
    const result = await api<{ tasks: Task[] }>(
      `/tasks/project/${projectId}?actorId=${encodeURIComponent(userId)}`,
    )
    setTasks(result.tasks)
    setMessage(`Loaded ${result.tasks.length} tasks`)
  }

  const loadProjectMembers = async (projectId = activeProjectId, userId = activeUserId) => {
    if (!projectId || !userId) return

    const result = await api<{ members: ProjectMember[] }>(
      `/projects/${projectId}/members?actorId=${encodeURIComponent(userId)}`,
    )
    setProjectMembers(result.members)
  }

  const handleAction = async (action: () => Promise<void>) => {
    try {
      await action()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unexpected error')
    }
  }

  const onRegister = async (event: FormEvent) => {
    event.preventDefault()
    await handleAction(async () => {
      const result = await api<{ user: User }>('/users/register', {
        method: 'POST',
        body: JSON.stringify(registerForm),
      })
      pushKnownUser(result.user)
      setRegisterForm({ login: '', password: '' })
      setIsAuthModalOpen(false)
      setMessage(`Registered ${result.user.name}`)
    })
  }

  const onLogin = async (event: FormEvent) => {
    event.preventDefault()
    await handleAction(async () => {
      const result = await api<{ user: User }>('/users/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      })
      pushKnownUser(result.user)
      setLoginForm({ login: '', password: '' })
      setIsAuthModalOpen(false)
      setMessage(`Logged in as ${result.user.name}`)
      await loadProjects(result.user.id)
    })
  }

  const openProjectCreation = () => {
    if (!activeUserId) {
      setAuthMode('login')
      setIsAuthModalOpen(true)
      return
    }

    setIsProjectModalOpen(true)
  }

  const openTaskCreation = () => {
    if (!activeUserId) {
      setAuthMode('login')
      setIsAuthModalOpen(true)
      return
    }

    if (!activeProjectId) {
      setMessage('Сначала выбери проект')
      return
    }

    setIsTaskModalOpen(true)
  }

  const logout = () => {
    setActiveUserId('')
    setActiveProjectId('')
    setActiveTaskId('')
    setProjects([])
    setProjectMembers([])
    setTasks([])
  }

  const onCreateProject = async (event: FormEvent) => {
    event.preventDefault()
    await handleAction(async () => {
      if (!activeUserId) throw new Error('Select or create a user first')
      const result = await api<{ project: Project }>('/projects', {
        method: 'POST',
        body: JSON.stringify({
          actorId: activeUserId,
          ownerId: projectOwnerId || activeUserId,
          ...projectForm,
        }),
      })

      setProjects((current) => {
        if (current.some((project) => project.id === result.project.id)) {
          return current
        }

        return [result.project, ...current]
      })
      setProjectForm({ name: '', description: '' })
      setProjectOwnerId(activeUserId)
      setActiveProjectId(result.project.id)
      setIsProjectModalOpen(false)
      await loadProjects(activeUserId)
    })
  }

  const onCreateTask = async (event: FormEvent) => {
    event.preventDefault()
    await handleAction(async () => {
      if (!activeProjectId || !activeUserId) {
        throw new Error('Choose active user and project first')
      }

      const result = await api<{ task: Task }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          actorId: activeUserId,
          projectId: activeProjectId,
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          assigneeId: taskForm.assigneeId || null,
        }),
      })
      setTasks((current) => [result.task, ...current])
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        assigneeId: '',
      })
      setActiveTaskId(result.task.id)
      setIsTaskModalOpen(false)
      setMessage(`Task "${result.task.title}" added to ${activeProject?.name ?? 'project'}`)
    })
  }

  const onDropTaskToColumn = async (columnStatus: BoardStatus) => {
    if (!draggedTaskId || !activeUserId) {
      return
    }

    const draggedTask = tasks.find((task) => task.id === draggedTaskId)

    if (!draggedTask || getBoardStatus(draggedTask.status) === columnStatus) {
      setDraggedTaskId('')
      return
    }

    await handleAction(async () => {
      const result = await api<{ task: Task }>(`/tasks/${draggedTaskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          actorId: activeUserId,
          status: columnStatus,
        }),
      })

      setTasks((current) =>
        current.map((task) => (task.id === result.task.id ? result.task : task)),
      )
      setActiveTaskId(result.task.id)
      setDraggedTaskId('')
    })
  }

  return (
    <main className="workspace">
      <section
        className={
          isResizingSidebar || isResizingTaskSidebar
            ? 'workspace__layout workspace__layout--resizing'
            : 'workspace__layout'
        }
        style={{
          gridTemplateColumns: `${isProjectSidebarCollapsed ? 74 : sidebarWidth}px 10px ${
            isTaskSidebarCollapsed ? 74 : taskSidebarWidth
          }px 10px minmax(0, 1fr)`,
        }}
      >
        <aside
          className={
            isProjectSidebarCollapsed
              ? 'sidebar sidebar--project sidebar--collapsed'
              : isTaskSidebarCollapsed
                ? 'sidebar sidebar--project sidebar--project-solo'
                : 'sidebar sidebar--project'
          }
        >
          <div className="sidebar__header">
            {isProjectSidebarCollapsed ? null : <h2>Проекты</h2>}
            <button
              type="button"
              className="sidebar__ghost sidebar__collapse"
              onClick={() => setIsProjectSidebarCollapsed((current) => !current)}
            >
              {isProjectSidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          {isProjectSidebarCollapsed ? (
            <div className="sidebar__collapsed-mark">Проекты</div>
          ) : (
            <>
              <button type="button" className="sidebar__action" onClick={openProjectCreation}>
                Добавить проект
              </button>

              <div className="sidebar__section">
                <div className="sidebar__section-title">
                  <span>Список проектов</span>
                  <button
                    type="button"
                    className="sidebar__ghost"
                    onClick={() => void handleAction(() => loadProjects())}
                  >
                    Обновить
                  </button>
                </div>
              </div>

              <ul className="list sidebar__list">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className={project.id === activeProjectId ? 'list__item active' : 'list__item'}
                    onClick={() => setActiveProjectId(project.id)}
                  >
                    <div>
                      <strong>{project.name}</strong>
                      <span>{project.description || 'No description'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        <div
          className={isResizingSidebar ? 'sidebar-resizer sidebar-resizer--active' : 'sidebar-resizer'}
          onMouseDown={() => setIsResizingSidebar(true)}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize projects sidebar"
        />

        <aside className={isTaskSidebarCollapsed ? 'sidebar sidebar--task sidebar--collapsed' : 'sidebar sidebar--task'}>
          <div className="sidebar__header">
            {isTaskSidebarCollapsed ? null : <h2>Задачи</h2>}
            <button
              type="button"
              className="sidebar__ghost sidebar__collapse"
              onClick={() => setIsTaskSidebarCollapsed((current) => !current)}
            >
              {isTaskSidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          {isTaskSidebarCollapsed ? (
            <div className="sidebar__collapsed-mark">Задачи</div>
          ) : (
            <>
              <button type="button" className="sidebar__action" onClick={openTaskCreation}>
                Добавить задачу
              </button>

              <div className="sidebar__section">
                <div className="sidebar__section-title">
                  <span>Список задач</span>
                  <button type="button" className="sidebar__ghost" onClick={() => void handleAction(() => loadTasks())}>
                    Обновить
                  </button>
                </div>
              </div>

              <ul className="list sidebar__list">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={task.id === activeTaskId ? 'list__item active' : 'list__item'}
                    onClick={() => setActiveTaskId(task.id)}
                  >
                    <div>
                      <strong>{task.title}</strong>
                      <span>{task.status} · {task.priority}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        <div
          className={isResizingTaskSidebar ? 'sidebar-resizer sidebar-resizer--active' : 'sidebar-resizer'}
          onMouseDown={() => setIsResizingTaskSidebar(true)}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize tasks sidebar"
        />

        <div className="workspace__content">
          <header className="workspace__header">
            <div className="workspace__auth">
              {activeUser ? (
                <>
                  <div className="workspace__auth-badge">{activeUser.name}</div>
                  <button type="button" className="workspace__auth-button workspace__auth-button--ghost" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="workspace__auth-button"
                  onClick={() => {
                    setAuthMode('login')
                    setIsAuthModalOpen(true)
                  }}
                >
                  Login
                </button>
              )}

              <p className="workspace__eyebrow">Task Management System</p>
            </div>
          </header>

          <section className="workspace__toolbar">
            <div className="toolbar-card">
              <strong>Context</strong>
              <select value={activeUserId} onChange={(event) => setActiveUserId(event.target.value)}>
                <option value="">Choose user</option>
                {knownUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} · {user.id.slice(0, 8)}
                  </option>
                ))}
              </select>
              <div className="toolbar-card__meta">
                <span>User: {activeUser ? activeUser.name : '—'}</span>
                <span>Project: {activeProject ? activeProject.name : '—'}</span>
                <span>Task: {activeTask ? activeTask.title : '—'}</span>
              </div>
              <div className="toolbar-card__meta">
                <span>{message}</span>
              </div>
            </div>
          </section>

          {activeProject ? (
            <section className="board">
              {BOARD_COLUMNS.map((column) => (
                <section
                  key={column.id}
                  className="board__column"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => void onDropTaskToColumn(column.id)}
                >
                  <div className="board__column-header">
                    <h2>{column.title}</h2>
                    <span className="board__column-count">{tasksByBoardStatus[column.id].length}</span>
                  </div>

                  <div className="board__column-body">
                    {tasksByBoardStatus[column.id].map((task) => (
                      <article
                        key={task.id}
                        className={task.id === activeTaskId ? 'task-card task-card--active' : 'task-card'}
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                        onDragEnd={() => setDraggedTaskId('')}
                        onClick={() => setActiveTaskId(task.id)}
                      >
                        <div className="task-card__header">
                          <strong>{task.title}</strong>
                          <span className="task-card__priority">{task.priority}</span>
                        </div>
                        <p>{task.description || 'No description'}</p>
                        <div className="task-card__meta">
                          <span>{task.assigneeId ? task.assigneeId.slice(0, 8) : 'No assignee'}</span>
                          <span>{task.status}</span>
                        </div>
                      </article>
                    ))}
                  </div>

                  {column.id === 'created' ? (
                    <button type="button" className="board__add-task" onClick={openTaskCreation}>
                      <span className="board__add-task-plus">+</span>
                      <span>Add task</span>
                    </button>
                  ) : (
                    <div />
                  )}
                </section>
              ))}
            </section>
          ) : (
            <section className="empty-state">
              <button type="button" className="empty-state__action" onClick={openProjectCreation}>
                Добавить проект
              </button>
            </section>
          )}
        </div>
      </section>

      {isProjectModalOpen ? (
        <div className="modal-backdrop" onClick={() => setIsProjectModalOpen(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="panel__header">
              <h2>Добавить проект</h2>
              <button type="button" className="sidebar__ghost" onClick={() => setIsProjectModalOpen(false)}>
                Закрыть
              </button>
            </div>

            <form className="stack" onSubmit={onCreateProject}>
              <div className="toolbar-card__meta">
                <span>Владелец проекта: {activeUser ? activeUser.name : 'не выбран'}</span>
              </div>
              <select value={projectOwnerId} onChange={(event) => setProjectOwnerId(event.target.value)}>
                <option value="">Choose owner</option>
                {knownUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} · {user.id.slice(0, 8)}
                  </option>
                ))}
              </select>
              <input
                placeholder="Project name"
                value={projectForm.name}
                onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))}
              />
              <textarea
                placeholder="Project description"
                value={projectForm.description}
                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
              />
              <button type="submit" disabled={!activeUserId || !projectOwnerId}>
                Create project
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {isAuthModalOpen ? (
        <div className="modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
          <div className="modal modal--auth" onClick={(event) => event.stopPropagation()}>
            <div className="panel__header">
              <h2>{authMode === 'login' ? 'Вход' : 'Регистрация'}</h2>
              <button type="button" className="sidebar__ghost" onClick={() => setIsAuthModalOpen(false)}>
                Закрыть
              </button>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={authMode === 'login' ? 'auth-tab auth-tab--active' : 'auth-tab'}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === 'register' ? 'auth-tab auth-tab--active' : 'auth-tab'}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>

            {authMode === 'login' ? (
              <form className="stack" onSubmit={onLogin}>
                <input
                  placeholder="Login"
                  value={loginForm.login}
                  onChange={(event) => setLoginForm((current) => ({ ...current, login: event.target.value }))}
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                />
                <button type="submit">Login</button>
              </form>
            ) : (
              <form className="stack" onSubmit={onRegister}>
                <input
                  placeholder="Login"
                  value={registerForm.login}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, login: event.target.value }))}
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                />
                <button type="submit">Register</button>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {isTaskModalOpen ? (
        <div className="modal-backdrop" onClick={() => setIsTaskModalOpen(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="panel__header">
              <h2>Добавить задачу</h2>
              <button type="button" className="sidebar__ghost" onClick={() => setIsTaskModalOpen(false)}>
                Закрыть
              </button>
            </div>

            <form className="stack" onSubmit={onCreateTask}>
              <div className="toolbar-card__meta">
                <span>Проект: {activeProject ? activeProject.name : 'не выбран'}</span>
              </div>
              <input
                placeholder="Task title"
                value={taskForm.title}
                onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))}
              />
              <textarea
                placeholder="Task description"
                value={taskForm.description}
                onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))}
              />
              <div className="inline-grid">
                <select
                  value={taskForm.priority}
                  onChange={(event) => setTaskForm((current) => ({ ...current, priority: event.target.value }))}
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
                <select
                  value={taskForm.assigneeId}
                  onChange={(event) => setTaskForm((current) => ({ ...current, assigneeId: event.target.value }))}
                >
                  <option value="">No assignee</option>
                  {projectMembers.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.name} · {member.role}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Create task</button>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default App
