import { Tree } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import request, { requestAdmin } from "../../utils/request";
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css'; // This only needs to be imported once in your app
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Button from '@mui/material/Button';
import { CircularProgress } from "@mui/material";

const LibraryZone = () => {
    const [treeData, setTreeData] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // load sections and Tiles
        fetchAllSections();
      }, []);
    
    const fetchAllSections = (filter = {}) => {
        request({
        url: '/v2/section',
        method: 'GET'
        })
        .then((data: any) => {
            setSectionData(data);
        });
    }
    
    const postData=()=>{
      setRefreshing(true);
      const response = request({
        url: '/v2/section/bulkupdate',
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        data:treeData
      }).then((response) => {
          setRefreshing(false);
          // console.log(response);
          setSectionData(response);
      });
    }
    const imgStyle = {
      'width': '40px',
      'height': '40px',
      'padding':'2px',
      'marginRight':'5px',
      'resizeMode': 'stretch',
    }
    const icoStyle = {
      'width': '50px',
      'height': '30px',
      'marginRight':'5px',
      'marginLeft':'5px',
      'resizeMode': 'stretch',
    }
    const flex={
      "display":"flex",
      "alignItems":"center"
    }
    const flexv={
      "display":"flex",
      "flex-direction": "column",
      "padding":"5px",
    }
    const order={
        "fontSize":"13px",
        "padding":"5px",
        'background': 'gray',
        'border-radius': '15px',
        'width': '30px',
        'text-align': 'center',
        "marginLeft":"5px",
        "marginRight":"5px"

    }
    
    const loader={
      "text-align":"center",
      "width":"100%"
    };
    const setSectionData= (sections:any)=>{
        let sections_tiles:any=[];
        let sections_tiles1:any=[];

        let id=0;
        sections.forEach((section:any) => {
            let sec_obj={
                          title:(<div style={flex} ><img style={imgStyle} src={section.sectionIcon}></img> {section.sectionName}</div>)
                          ,expanded:false
                          ,sectionId:section.sectionId
                          ,sectionName:section.sectionName
                          ,children:[{}]
                          };
            id++;
            
            section.tiles.forEach((tile:any) => {
              
                sec_obj.children.push({title:(<div style={flex}>
                                              
                                              <small style={order}>{tile.order}</small>
                                              {tile.isVideo==1?<OndemandVideoIcon />:<VideogameAssetIcon />}
                                              <img style={icoStyle} src={tile.iconUrl}></img> 
                                              <div style={flexv}>
                                              {tile.title}
                                              <small>{"Age:"+tile.minAge+"-"+tile.maxAge}</small>
                                              </div>
                                              </div>)
                                              ,
                                        order:tile.order,
                                        tileId:tile.tileId,
                                        sectionId:tile.sectionId
                                            });
            });
            sec_obj.children.shift();
            sections_tiles1.push(sec_obj);      
            
        });
        setTreeData(sections_tiles1);

    }


    const canDrop=( options:any ): boolean =>{
      if(options.node.is_parent)
        return false;

      return true;
    };

    const onTreeChange=( data:any )=>{
      console.log(data);
      setTreeData(data);
    };

   
  return (
        <div style={{ height: '100vh' }}>
          <h2>Sections And Tiles <Button onClick={postData}  style={{float:"right"}} variant="contained">Save Changes</Button></h2>
          {refreshing?(<p style={loader}><CircularProgress /><br/>Please wait.Refreshing data</p>):""}
          <div style={{ height: '100vh',overflow:"auto" }}>
            <SortableTree
            treeData={treeData}
            onChange={(treeData)=>onTreeChange(treeData)}
            canDrop={canDrop}
          />
          </div>
        </div>
  );


  }
export default LibraryZone;