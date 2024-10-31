import React, { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, Select, Button, CircularProgress } from '@mui/material';
import { useDataProvider, useNotify } from 'react-admin';

const FlexibleApplicantFilter = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const [filters, setFilters] = useState({
        skillId: '',  // Filtro por habilidad
        positionId: '',  // Filtro por posición
        educationId: '',  // Filtro por educación
    });
    const [results, setResults] = useState([]);
    const [skills, setSkills] = useState([]);
    const [positions, setPositions] = useState([]);
    const [educations, setEducations] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(true);
    const [loadingPositions, setLoadingPositions] = useState(true);
    const [loadingEducations, setLoadingEducations] = useState(true);

    // Función para manejar el cambio de filtro
    const handleFilterChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
    };

    // Función para realizar la búsqueda en base a los filtros de habilidades, posición y educación (con POST)
    const handleSearch = async () => {
        const { skillId, positionId, educationId } = filters;

        try {
            // Hacemos la solicitud POST al dataProvider
            const { data } = await dataProvider.create('applicants/filter', {
                data: { // Enviamos los filtros en el cuerpo de la solicitud
                    skillId: skillId || undefined,
                    positionId: positionId || undefined,
                    educationId: educationId || undefined,
                },
            });
            setResults(data.data); // Guardamos los resultados en el estado, data viene dentro de la propiedad 'data'
        } catch (error) {
            notify(`Error: ${error.message}`, { type: 'warning' });
        }
    };

    // Función para cargar las habilidades desde la API
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoadingSkills(true);
                const { data } = await dataProvider.getList('skills', {
                    pagination: { page: 1, perPage: 100 }, 
                    sort: { field: 'description', order: 'ASC' },
                });
                setSkills(data); 
                setLoadingSkills(false);
            } catch (error) {
                notify(`Error fetching skills: ${error.message}`, { type: 'warning' });
                setLoadingSkills(false);
            }
        };

        fetchSkills();
    }, [dataProvider, notify]);

    // Función para cargar las posiciones desde la API
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                setLoadingPositions(true);
                const { data } = await dataProvider.getList('positions', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                });
                setPositions(data);
                setLoadingPositions(false);
            } catch (error) {
                notify(`Error fetching positions: ${error.message}`, { type: 'warning' });
                setLoadingPositions(false);
            }
        };

        fetchPositions();
    }, [dataProvider, notify]);

    // Función para cargar los niveles de educación desde la API
    useEffect(() => {
        const fetchEducations = async () => {
            try {
                setLoadingEducations(true);
                const { data } = await dataProvider.getList('education', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'level', order: 'ASC' },
                });
                setEducations(data);
                setLoadingEducations(false);
            } catch (error) {
                notify(`Error fetching education levels: ${error.message}`, { type: 'warning' });
                setLoadingEducations(false);
            }
        };

        fetchEducations();
    }, [dataProvider, notify]);

    return (
        <Box>
            <Typography variant="h6">Search Applicants by Skill, Position, and Education</Typography>

            {/* Mostrar indicador de carga mientras se obtienen las habilidades */}
            {loadingSkills ? (
                <CircularProgress />
            ) : (
                <Select
                    value={filters.skillId}
                    onChange={(e) => handleFilterChange('skillId', e.target.value)}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="" disabled>
                        Select a Skill
                    </MenuItem>
                    {skills.map((skill) => (
                        <MenuItem key={skill.id} value={skill.id}>
                            {skill.description}
                        </MenuItem>
                    ))}
                </Select>
            )}

            {/* Mostrar indicador de carga mientras se obtienen las posiciones */}
            {loadingPositions ? (
                <CircularProgress />
            ) : (
                <Select
                    value={filters.positionId}
                    onChange={(e) => handleFilterChange('positionId', e.target.value)}
                    displayEmpty
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    <MenuItem value="" disabled>
                        Select a Position
                    </MenuItem>
                    {positions.map((position) => (
                        <MenuItem key={position.id} value={position.id}>
                            {position.name}
                        </MenuItem>
                    ))}
                </Select>
            )}

            {/* Mostrar indicador de carga mientras se obtienen los niveles de educación */}
            {loadingEducations ? (
                <CircularProgress />
            ) : (
                <Select
                    value={filters.educationId}
                    onChange={(e) => handleFilterChange('educationId', e.target.value)}
                    displayEmpty
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    <MenuItem value="" disabled>
                        Select Education Level
                    </MenuItem>
                    {educations.map((education) => (
                        <MenuItem key={education.id} value={education.id}>
                            {education.level}
                        </MenuItem>
                    ))}
                </Select>
            )}

            {/* Botón para buscar */}
            <Button variant="contained" color="primary" onClick={handleSearch} disabled={loadingSkills || loadingPositions || loadingEducations} style={{ marginTop: '20px' }}>
                Search
            </Button>

            {/* Mostrar los resultados */}
            <Box mt={2}>
                <Typography variant="h6">Results</Typography>
                {results.length > 0 ? (
                    <ul>
                        {results.map((applicant) => (
                            <li key={applicant.id}>
                                {applicant.user.firstName} {applicant.user.lastName} - {applicant.position.name} - Desired Salary: {applicant.desiredSalary} - Recommended By: {applicant.recommendedBy}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography>No results found</Typography>
                )}
            </Box>
        </Box>
    );
};

export default FlexibleApplicantFilter;
