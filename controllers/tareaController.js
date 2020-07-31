// controllers > tareaController.js

const Tarea = require('../models/Tarea'); 
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator'); 

exports.crearTarea = async (req, res) => { 
    const errores = validationResult(req); 
    if(!errores.isEmpty()){ 
        return res.status(400).json({errores: errores.array() })
    }
    
     

    try { 
        const { proyecto } = req.body;
    
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) { 
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        const tarea = new Tarea(req.body); 
        await tarea.save(); 
        res.json({ tarea })


    }catch (error) { 
        console.log(error); 
        res.status(500).send('Hubo un error');
    }

}

exports.obtenerTareas = async (req, res )=>{ 
    try {
        const { proyecto } = req.body;
    
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) { 
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        const tareas = await Tarea.find({ proyecto})
        res.json({ tareas });

    } catch (error) {
        
        console.log(error); 
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async (req, res) => { 
    
    try {
        const { proyecto, nombre, estado } = req.body;

        let tarea = await Tarea.findById(req.params.id)

        if(!tarea) { 
            return res.status(404).json({msg: 'NO exite esa tarea'})
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }


        const nuevaTarea = {}; 
        if(nombre){ 
            nuevaTarea.nombre = nombre; 
        }
        if(estado){ 
            nuevaTarea.estado = estado; 
        }

        tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, {new: true});

        res.json({ tarea });

        
    } catch (error) {
        console.log(error); 
        res.status(500).send('Hubo un error');
    }


}

exports.eliminarTarea = async (req, res) => {
    try {
        const { proyecto } = req.body; 

        let tarea = await Tarea.findById(req.params.id); 
        if(!tarea) { 
            return res.status(404).json({msg: 'Tarea no encontrado'})
        }
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        await Tarea.findOneAndRemove({_id: req.params.id}); 
        
        res.json({msg: "tarea eliminada"})

    } catch (error) {
        console.log(error); 
        res.status(500).send('Hubo un error');
    }
}