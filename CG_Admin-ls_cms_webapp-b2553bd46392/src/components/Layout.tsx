import React, { FC } from "react";
import MiniDrawer from "./Sidebar";
interface Props {
    // any props that come into the component
}

const Layout: FC<Props> = ({ children }) => {
    console.log("LAYOUT RENDERED");
    return (
        <>
            <div>
                <MiniDrawer>
                    <main>{children}</main>
                </MiniDrawer>
            </div>
        </>
    )
}
export default Layout;