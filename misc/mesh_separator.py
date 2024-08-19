# https://blenderartists.org/t/how-to-get-vertex-position-and-connected-vertices/1185279/2
# https://blenderartists.org/t/select-and-translate-vertices-with-python/555961
# useful for exploring objects that may have multiple parts (e.g. Morrowind assets :) )

import bpy
import bmesh

obj = bpy.context.view_layer.objects.active.data

# need to be in EDIT mode
bm = bmesh.from_edit_mesh(obj)

vert_map = {}

for vert in bm.verts:
    connected = []
    for link in vert.link_edges:
        connected.append(link.other_vert(vert).index)
    vert_map[vert.index] = connected

def depth_first_traversal(start_idx, seen, mesh_vertices_set, vert_map):
    # mark as seen all the vertices to the vertex
    # at start_idx - all these vertices should form a single mesh
    stack = [start_idx]
    while len(stack) > 0:
        curr = stack.pop()
        seen.add(curr)
        mesh_vertices_set.add(curr)
        neighbors = vert_map[curr]
        for neighbor in neighbors:
            if neighbor not in seen:
                stack.append(neighbor)
                
def extrude_individual_meshes(mesh_record):
    # move vertices that belongs to each individual mesh
    # to more easily see the meshes
    for mesh in mesh_record:
        for vert_idx in mesh_record[mesh]:
            vtx = bm.verts[vert_idx]
            vtx.co += vtx.normal * 5.0
    
    obj.update()
                
def find_separable_meshes(vert_map):
    mesh_count = 0
    mesh_record = {}
    seen_verts = set()
    
    for vert_idx in vert_map:
        if vert_idx in seen_verts:
            continue
        else:            
            mesh_count += 1
            mesh_record[mesh_count] = set()
            print(f'new mesh found @ vertex {vert_idx}')
            
            depth_first_traversal(vert_idx, seen_verts, mesh_record[mesh_count], vert_map)
              
    return (mesh_count, mesh_record)

"""
def find_separable_meshes(vert_map):
    mesh_count = 0
    mesh_record = {}
    seen_verts = set()
    
    for vert_idx in vert_map:
        if vert_idx in seen_verts:
            continue
        
        connected_verts = vert_map[vert_idx]
        
        seen_verts.add(vert_idx)
        
        is_new_mesh = True
        for v in connected_verts:
            if v in seen_verts:
                is_new_mesh = False
                break                
        
        if is_new_mesh:
            mesh_count += 1
            mesh_record[mesh_count] = set()
            print(f'new mesh found @ vertex ${vert_idx}')
            
        for v in connected_verts:
            mesh_record[mesh_count].add(v)
            seen_verts.add(v)
            
    return (mesh_count, mesh_record)
"""

res = find_separable_meshes(vert_map)

print(f'{res[0]} meshes found')
#print(res[1][1])

extrude_individual_meshes(res[1])
