// GlobalProvider.jsx

import { AgentDialogProvider } from "../Context/AgentDialogContext";
import { AreaDialogProvider } from "../Context/AreaDialogContext";
import { BranchDialogProvider } from "../Context/BranchesDialogContext";
import { CategoryDialogProvider } from "../Context/CategoryDialogContext";
import { DialogProvider } from "../Context/DialogContext";
import { EmployeeDialogProvider } from "../Context/EmployeeDialogContext";
import { ErrorDialogProvider } from "../Context/ErrorContext";
import { GroupDialogProvider } from "../Context/GroupDialogContext";
import { GstRegistrationDialogProvider } from "../Context/GstRegistrationDialogContext";
import { ItemDialogProvider } from "../Context/ItemDialogContext";
import { LogisticsDialogProvider } from "../Context/LogisticsDialogContext";
import { PincodeDialogProvider } from "../Context/PincodeDialogContext";
import { PurchaseOrderEntriesProvider } from "../Context/PurchaseOrderEntriesDialogContext";
import { QualificationDialogProvider } from "../Context/QualificationContext";
import { RoleDialogProvider } from "../Context/RoledialogContext";
import { SearchProvider } from "../Context/SearchContext";
import { TdsDetailsDialogProvider } from "../Context/TdsDetailDialogContext";
import { ToastProvider } from "../Context/ToastProvider";
import { VendorGroupDialogProvider } from "../Context/VendorGroupDialogContext";
import { DiscountDialogProvider } from "../Context/DiscountDialogContext";
import { CustomerDialogProvider } from "../Context/CustomerDilaogContext";
import { SalesDialogProvider } from "../Context/SalesDialogContext";



const GlobalProvider = ({ children }) => {
  return (
    <SearchProvider>
    <ToastProvider>
      <DialogProvider>
        <AreaDialogProvider>
          <AgentDialogProvider>
            <GroupDialogProvider>
              <CategoryDialogProvider>
                <ItemDialogProvider>
                  <GstRegistrationDialogProvider>
                    <TdsDetailsDialogProvider>
                      <EmployeeDialogProvider>
                        <RoleDialogProvider>
                          <BranchDialogProvider>
                            <VendorGroupDialogProvider>
                              <ErrorDialogProvider>
                                <QualificationDialogProvider>
                                  <PincodeDialogProvider>
                                    <LogisticsDialogProvider>
                                      <PurchaseOrderEntriesProvider>
                                        <DiscountDialogProvider>
                                          <CustomerDialogProvider>
                                            <SalesDialogProvider>
                                      {children}
                                            </SalesDialogProvider>
                                      </CustomerDialogProvider>
                                      </DiscountDialogProvider>
                                      </PurchaseOrderEntriesProvider>
                                    </LogisticsDialogProvider>
                                  </PincodeDialogProvider>
                                </QualificationDialogProvider>
                              </ErrorDialogProvider>
                            </VendorGroupDialogProvider>
                          </BranchDialogProvider>
                        </RoleDialogProvider>
                      </EmployeeDialogProvider>
                    </TdsDetailsDialogProvider>
                  </GstRegistrationDialogProvider>
                </ItemDialogProvider>
              </CategoryDialogProvider>
            </GroupDialogProvider>
          </AgentDialogProvider>
        </AreaDialogProvider>
      </DialogProvider>
    </ToastProvider>
    </SearchProvider>
  );
};

export default GlobalProvider;
